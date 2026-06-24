import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  app.get("/api/ip", (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.json({ ip });
  });

  // Gemini API Initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // List of models to try in order of preference
  const FALLBACK_MODELS = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  // API Route for AI Generation
  app.post("/api/generate", async (req, res) => {
    try {
      const { systemPrompt, userMessage, stream } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
      }

      let lastError = null;

      if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let success = false;
        for (const modelName of FALLBACK_MODELS) {
          try {
            const result = await ai.interactions.create({ 
              model: modelName,
              input: userMessage,
              system_instruction: systemPrompt,
              stream: true
            });

            for await (const event of result) {
              if (event.event_type === "step.delta" && event.delta.type === "text") {
                res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
              }
            }
            res.write("data: [DONE]\n\n");
            res.end();
            success = true;
            break;
          } catch (error: any) {
            console.error(`Error with model ${modelName}:`, error.message);
            lastError = error;
            // Continue to next model if it's a quota, availability, or model-not-found error
            const status = error.status || 500;
            if (status !== 429 && status !== 404 && status !== 503) break;
          }
        }
        if (!success) {
          res.write(`data: ${JSON.stringify({ error: "AI service currently busy. Please try again in 30 seconds." })}\n\n`);
          res.end();
        }
      } else {
        let responseText = null;
        for (const modelName of FALLBACK_MODELS) {
          try {
            const interaction = await ai.interactions.create({ 
              model: modelName,
              input: userMessage,
              system_instruction: systemPrompt
            });
            
            // Extract text from the interaction steps
            let fullText = "";
            for (const step of interaction.steps) {
              if (step.type === 'model_output') {
                const textPart = step.content?.find(c => c.type === 'text');
                if (textPart && textPart.text) {
                  fullText += textPart.text;
                }
              }
            }
            responseText = fullText || interaction.output_text;
            break;
          } catch (error: any) {
            console.error(`Error with model ${modelName}:`, error.message);
            lastError = error;
            const status = error.status || 500;
            if (status !== 429 && status !== 404 && status !== 503) break;
          }
        }
        if (responseText) {
          res.json({ text: responseText });
        } else {
          res.status(503).json({ error: "AI service currently busy. Please try again in 30 seconds." });
        }
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "The AI service is temporarily unavailable. Please wait a moment." });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
