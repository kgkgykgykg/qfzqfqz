export interface Example {
  title: string;
  tag: string;
  prompt: string;
  result: string;
}

export const toolExamples: Record<string, Example[]> = {
  email: [
    {
      title: 'Product Launch for Skincare Brand',
      tag: 'E-commerce',
      prompt: 'I sell premium organic skincare products and I want to announce a new anti-aging serum to my email list.',
      result: `Subject: Your Skin Has Been Waiting for This

[Name],

We spent 18 months perfecting a formula that actually delivers on its promises.

Introducing our new Advanced Retinol Renewal Serum — a clinical-grade formula made with 100% organic botanicals, designed to visibly reduce fine lines in as little as 14 days.

What makes it different:

- 2.5% encapsulated retinol for deep absorption without irritation
- Bakuchiol + Hyaluronic Acid for hydration while you renew
- Cold-pressed rosehip oil for a natural, radiant glow
- Dermatologist tested. Cruelty-free. Always.

For the first 48 hours, get 20% off your first bottle with code RENEWAL20.

Shop the Serum: [Link]

You deserve skincare that works as hard as you do.

Warm regards,
The [Brand] Team`,
    },
    {
      title: 'Re-engagement Campaign for SaaS',
      tag: 'SaaS',
      prompt: 'My project management SaaS has inactive users who haven\'t logged in for 30 days. Win them back.',
      result: `Subject: We noticed you've been away

[Name],

Your workspace is exactly how you left it — your projects, your data, your team's progress. It's all still here.

But here's what you missed:

- Kanban board redesign — drag, drop, done. 3x faster.
- AI task suggestions — let the system prioritize your workload.
- New integrations — Slack, Notion, and Figma are now one click away.

We built these features because users like you asked for them.

Come back and see what's new: [Link]

If something wasn't working for you, reply to this email. I read every response personally.

— [Founder Name], CEO`,
    },
    {
      title: 'Flash Sale for Fashion Store',
      tag: 'Retail',
      prompt: 'I have an online streetwear store and I\'m doing a 48-hour flash sale, 40% off everything.',
      result: `Subject: 40% off everything. 48 hours only.

[Name],

This is not a drill.

For the next 48 hours, everything on the site is 40% off. No minimum. No exclusions. Every hoodie, every pair of sneakers, every accessory.

Use code FLASH40 at checkout.

Top picks selling fast:

- Oversized Essential Hoodie — $89 $53.40
- Cargo Joggers — $75 $45.00
- Logo Cap — $35 $21.00

Sale ends [Date] at midnight. Once it's over, it's over.

Shop Now: [Link]

— [Brand] Team`,
    },
  ],

  sms: [
    {
      title: 'Flash Sale Alert',
      tag: 'Retail',
      prompt: 'Flash sale 50% off on my online clothing store for 24 hours.',
      result: `[Brand]: 50% OFF everything. 24 hours only. No code needed. Shop now before it's gone: [Link]

[Brand]: LAST CALL. 50% off ends at midnight tonight. Don't miss it: [Link]

[Brand]: Your cart is calling. 50% off sitewide — today only. Tap here: [Link]`,
    },
    {
      title: 'Appointment Reminder',
      tag: 'Service',
      prompt: 'Remind dental clinic patients of their upcoming appointment and offer a teeth whitening promo.',
      result: `Hi [Name], reminder: your appointment is on [Date] at [Time]. Need to reschedule? Reply CHANGE or call us at [Phone].

[Clinic]: Get 30% off professional teeth whitening when you book this month. Limited spots. Book: [Link]`,
    },
    {
      title: 'New Collection Drop',
      tag: 'E-commerce',
      prompt: 'Announce the new summer collection for a premium sunglasses brand.',
      result: `[Brand]: Summer '25 just dropped. Limited edition frames. First 100 orders get free express shipping. Shop: [Link]

[Brand]: New collection is live. Bold frames. Premium lenses. Your summer upgrade starts here: [Link]

[Brand]: You asked, we delivered. 12 new styles. 0 compromises. See what's new: [Link]`,
    },
  ],

  script: [
    {
      title: '60-Second YouTube Ad',
      tag: 'Video Ad',
      prompt: 'A 60-second YouTube pre-roll ad for an AI-powered accounting tool for freelancers.',
      result: `[Open on freelancer staring at a pile of receipts, looking stressed]

NARRATOR: You didn't become a freelancer to spend your weekends doing taxes.

[Cut to laptop screen showing the app dashboard]

NARRATOR: Meet [Product] — the AI accounting tool built for freelancers, by freelancers.

[Screen recording: invoices auto-categorizing]

NARRATOR: It reads your invoices. It categorizes your expenses. It tracks your revenue in real time.

[Split screen: old way vs. new way]

NARRATOR: What used to take you 6 hours a month now takes 6 minutes.

[Show tax report generating automatically]

NARRATOR: And when tax season hits, your reports are already done. One click. Download. File. Finished.

[Cut to freelancer at a coffee shop, relaxed, working on creative projects]

NARRATOR: Stop managing your money. Start making more of it.

[Logo + CTA on screen]

NARRATOR: Try [Product] free for 30 days. No credit card required.

[End card: URL + QR code]`,
    },
    {
      title: 'Cold Call for B2B Software',
      tag: 'Sales Call',
      prompt: 'A cold calling script to sell inventory management software to small retail store owners.',
      result: `[Greeting]
Hi, is this [Owner Name]? Great. My name is [Your Name] from [Company]. I'll be brief — I know you're busy running your store.

[Hook — 10 seconds]
I'm reaching out because we've helped over 200 retail stores like yours cut stock-related losses by 35% in the first quarter alone.

[Qualify]
Quick question — are you currently tracking your inventory manually or using a system?

[If manual]: That's exactly why I called. Most store owners we talk to are spending 8-10 hours a week counting stock and still dealing with out-of-stock issues.

[If using a system]: Got it. What's your biggest frustration with it right now?

[Value pitch]
What we do is give you a real-time dashboard of everything in your store. You scan items in, the system tracks what's selling, what's sitting, and it even sends you reorder alerts before you run out.

[Social proof]
[Client Name] runs a boutique similar to yours in [City]. She told me she saved $12,000 in her first year just by reducing overstock.

[Close]
I'd love to show you a quick 15-minute demo — no commitment. Would Tuesday or Thursday work better for you this week?`,
    },
  ],

  adcopy: [
    {
      title: 'Fitness App Launch Campaign',
      tag: 'App Launch',
      prompt: 'Launch campaign for a fitness app that uses AI to create personalized workout plans.',
      result: `Your gym doesn't know you. Your trainer sees you 3 hours a week. Our AI watches every rep, every rest, every plateau — and adapts your plan in real time.

Personalized workouts. Zero guesswork. Download free.

#FitnessApp #AIWorkout #PersonalTrainer #FitTech

---

Stop following workout plans made for someone else.

Our AI builds yours from scratch — based on your goals, your body, your schedule, and how you performed yesterday.

150,000 users. 4.9 stars. Free to start.

Download now: [Link]

#Fitness #WorkoutPlan #AIFitness #GymLife

---

"I gained more in 8 weeks with this app than 2 years with a personal trainer." — Sarah M.

AI-powered. Fully personalized. Adapts daily.

Try it free: [Link]

#TransformationTuesday #FitnessMotivation #AICoach`,
    },
    {
      title: 'Premium Coffee Brand Ads',
      tag: 'E-commerce',
      prompt: 'Social media ads for a premium single-origin coffee subscription box.',
      result: `Your morning deserves better than mass-produced beans.

Single-origin. Roasted this week. Delivered to your door.

Every box includes beans from a different farm, tasting notes, and a brewing guide crafted by our head roaster.

First box: $14.99. Cancel anytime.

#SpecialtyCoffee #CoffeeSubscription #SingleOrigin

---

We visited 47 farms across 12 countries to find coffee worth waking up for.

Each month, we pick one. Roast it fresh. Ship it straight to you with the farmer's story inside.

No blends. No fillers. No compromise.

Subscribe: [Link]

#CoffeeLover #FreshRoast #MorningRitual #ThirdWave

---

The difference between good coffee and great coffee? 72 hours.

That's how fresh your beans are when they arrive. Roasted to order. Never sitting on a shelf.

First box ships free.

#FreshCoffee #CoffeeAddict #HomeBarista`,
    },
  ],

  image: [
    {
      title: 'Luxury Skincare Product Shots',
      tag: 'Product',
      prompt: 'Product photography concepts for a luxury organic skincare brand, minimalist and premium feel.',
      result: `A single frosted glass serum bottle centered on a slab of raw white marble, soft directional morning light from the left, a sprig of dried lavender beside it, clean cream-colored backdrop, shallow depth of field, editorial beauty photography, shot on Hasselblad, 4K

---

Flat lay arrangement of skincare products on a linen cloth, muted earth tones, a ceramic dish with raw shea butter, scattered dried botanicals, soft overhead natural lighting, negative space for text overlay, magazine editorial style, minimal and luxurious

---

Close-up macro shot of serum drops falling from a glass dropper into a small pool of golden oil, backlit with warm studio light, bokeh background in soft champagne tones, hyper-detailed texture on the liquid, commercial beauty ad style, 8K resolution

---

A model's hand with natural nails gently holding a matte white jar against a soft-focus background of eucalyptus leaves and steam, spa atmosphere, warm neutral color palette, product hero shot, luxury cosmetics campaign`,
    },
    {
      title: 'Tech Startup Brand Visuals',
      tag: 'Brand',
      prompt: 'Modern brand visuals for a fintech startup, professional and trustworthy.',
      result: `Abstract 3D render of interconnected geometric nodes forming a network, deep navy blue background with subtle gradient to midnight, glowing edges in electric blue and white, clean corporate futuristic aesthetic, 8K resolution, suitable for website hero section

---

Isometric illustration of a smartphone displaying a financial dashboard with clean charts and graphs, floating UI elements around it, soft shadows, white background with subtle blue accents, modern flat design with depth, tech company marketing material

---

Professional photograph of a diverse team of four people collaborating around a glass table with laptops and tablets, modern office with floor-to-ceiling windows, natural daylight, shallow depth of field focused on the central screen showing analytics, corporate but approachable, shot on Canon EOS R5

---

Minimal logo mockup on a dark matte business card resting on a polished concrete surface, dramatic side lighting creating long shadows, brand colors in navy and white, ultra-clean composition, product photography style`,
    },
  ],

  video: [
    {
      title: '30s TikTok Product Promo',
      tag: 'TikTok',
      prompt: '30-second TikTok video to promote a portable blender for smoothies on the go.',
      result: `[HOOK - 0:00-0:03]
[Close-up of a sad desk lunch — limp sandwich, chips]
"Stop eating like you've given up on yourself."

[PROBLEM - 0:03-0:08]
[Quick cuts: drive-through lines, overpriced smoothie shop receipt showing $14]
"You want to eat healthy but you don't have time, and you're tired of paying $14 for a smoothie."

[REVEAL - 0:08-0:15]
[Product slides into frame on a clean surface. One-hand pickup.]
"This blender is the size of a water bottle. 60 seconds, anywhere, any time."
[Quick cuts: blending at a desk, in a car, at the gym, at a park]

[PROOF - 0:15-0:22]
[Pouring a vibrant green smoothie into a glass. Beauty shot.]
"Frozen fruit, protein powder, ice — it handles everything. USB-C rechargeable. 15 blends per charge."

[CTA - 0:22-0:30]
[Person drinking smoothie, looking satisfied]
"Link in bio. Use code BLEND20 for 20% off."
[End card: product lineup + code + price]`,
    },
    {
      title: 'YouTube Customer Testimonial',
      tag: 'YouTube',
      prompt: 'A 2-minute customer testimonial video for an online business coaching program.',
      result: `[HOOK - 0:00-0:03]
[Close-up of the client, looking into camera]
"I was $40,000 in debt and thinking about shutting down my business."

[CONTEXT - 0:03-0:25]
[Client sitting in their home office / workspace, natural lighting]
"I started my online store two years ago. I was doing everything myself — ads, fulfillment, customer service. I was working 16-hour days and barely breaking even."
[B-roll: old screenshots of their store, ad dashboards showing poor results]
"I'd tried courses before. Watched hundreds of YouTube videos. Nothing clicked."

[DISCOVERY - 0:25-0:50]
[Client gestures naturally while talking]
"A friend told me about [Program Name]. I was skeptical — I'd been burned before. But the first call with my coach completely changed how I saw my business."
[B-roll: program dashboard, community screenshots]
"They didn't give me generic advice. They looked at my numbers, my products, my ads — and gave me a specific plan."

[RESULTS - 0:50-1:25]
[Screen recordings of Shopify dashboard, revenue graphs going up]
"Within 60 days, I went from $3K months to $18K months. Within 6 months, I crossed $50K."
[Client smiling, confident]
"I paid off my debt. I hired two people. I actually take weekends off now."
[B-roll: lifestyle shots — with family, traveling, relaxed]

[RECOMMENDATION - 1:25-1:50]
[Back to client, direct to camera]
"If you're on the fence, I get it. I was too. But this program gave me structure, accountability, and a mentor who actually cared about my results."
"It's not magic. It's work. But it's the right work, for the first time."

[CTA - 1:50-2:00]
[Client smiles]
"Check out the link below. Book the free call. You've got nothing to lose."
[End card: program logo, URL, call-to-action button]`,
    },
  ],

  hooks: [
    {
      title: 'E-commerce Store Hooks',
      tag: 'E-commerce',
      prompt: 'Hooks for TikTok and Reels to promote a dropshipping store selling home gadgets.',
      result: `1. "This $12 gadget replaced 4 things in my kitchen."
2. "I've been using this for 3 weeks and my wife thinks I'm a genius."
3. "Amazon sellers don't want you to know about this product."
4. "Stop scrolling — this thing will change your morning routine."
5. "I bought this as a joke but now I can't live without it."
6. "POV: you just found the product that saves you 30 minutes a day."
7. "Everyone in the comments is going to ask for the link."
8. "This is the #1 selling home gadget in Japan right now."
9. "I showed this to my mom and she ordered 5 immediately."
10. "If this doesn't blow your mind, nothing will."`,
    },
    {
      title: 'Personal Brand / Coaching',
      tag: 'Coaching',
      prompt: 'Hooks for LinkedIn and Instagram posts for a business coach targeting entrepreneurs.',
      result: `1. "I made $0 for 11 months before making $100K in month 12. Here's what changed."
2. "The advice that almost killed my business — and what I do instead."
3. "I fired my biggest client last week. Best decision I ever made."
4. "Most entrepreneurs are busy. Very few are productive. Here's the difference."
5. "You don't need more leads. You need a better offer. Let me explain."
6. "I spent $50K on courses before I learned this one free lesson."
7. "Your business doesn't have a revenue problem. It has a clarity problem."
8. "I asked 200 six-figure entrepreneurs the same question. Here's what they said."
9. "Stop posting content. Start posting this instead."
10. "The reason you're stuck at $10K/month has nothing to do with marketing."`,
    },
  ],
};

export const calcExamples: Record<string, { title: string; values: Record<string, string> }[]> = {
  'profit-margin': [
    { title: 'Dropshipping Product', values: { sellingPrice: '49.99', productCost: '12.50', shippingCost: '4.99', adsCost: '15.00', otherCosts: '2.00' } },
    { title: 'Print-on-Demand T-Shirt', values: { sellingPrice: '29.99', productCost: '8.00', shippingCost: '3.50', adsCost: '8.00', otherCosts: '1.50' } },
  ],
  roas: [
    { title: 'High-Ticket Product', values: { sellingPrice: '149.99', productCost: '35.00', shippingCost: '8.00', conversionRate: '2.5' } },
    { title: 'Low-Ticket Impulse Buy', values: { sellingPrice: '24.99', productCost: '5.00', shippingCost: '3.00', conversionRate: '4.0' } },
  ],
  roi: [
    { title: 'Facebook Ads Campaign', values: { investment: '5000', revenue: '18500' } },
    { title: 'Influencer Collaboration', values: { investment: '2000', revenue: '7800' } },
  ],
  ltv: [
    { title: 'Subscription Box', values: { avgOrderValue: '39.99', purchaseFrequency: '12', customerLifespan: '2.5', profitMargin: '45' } },
    { title: 'Fashion E-commerce', values: { avgOrderValue: '85.00', purchaseFrequency: '4', customerLifespan: '3', profitMargin: '55' } },
  ],
  'ecom-profit': [
    { title: 'Growing Shopify Store', values: { monthlyRevenue: '25000', cogs: '8000', shipping: '2500', marketing: '5000', overhead: '1500' } },
    { title: 'Established Brand', values: { monthlyRevenue: '120000', cogs: '36000', shipping: '9600', marketing: '24000', overhead: '8000' } },
  ],
};
