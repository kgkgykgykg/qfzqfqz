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

  'product-desc': [
    {
      title: 'Premium Sound ANC Headphones',
      tag: 'Electronics',
      prompt: 'Premium active noise-cancelling over-ear headphones with 45-hour battery life, quick USB-C charging, high-density memory foam earcups, geared towards frequent business travelers and remote web-developers.',
      result: `Headline: Absolute Silence. Immersive Mastery.

Escape the bustle and step inside pure high-fidelity sound. The SomnaSound ANC Over-Ear Headphones combine active multi-layer hybrid noise cancellation with unparalleled ergonomic comfort, giving you the silence you need to focus, create, and escape.

Key Benefits:
- Pro-Grade Hybrid ANC: Four internal microphones track and neutralize ambient noise, isolating voice frequencies for pristine sound.
- 45-Hour Battery Endurance: Enjoy up to 45 hours of non-stop playback on a single charge. Need a boost? A quick 10-minute USB-C charge yields 5 full hours of power.
- Cloud-Like Memory Foam Earcups: Wrapped in premium protein-mesh leather, the high-density adaptive memory foam earcups distribute pressure evenly for fatigue-free listening.
- Hi-Res Studio Drivers: Proprietary 40mm bio-cellulose drivers deliver thunderous clear lows, crisp mids, and sparkling highs up to 40kHz.

Sizing & Fit:
Universal adjustable stainless steel headband with swiveling earcups for convenient lay-flat travel storage. Lightweight design (240g).

SEO Snippet:
Experience studio-grade sound in complete silence. SomnaSound wireless active noise-cancelling over-ear headphones deliver 45-hour battery life, premium comfort earcups, and dual-source Bluetooth connectivity for professional music lovers and remote workers alike.`
    },
    {
      title: 'Terra Insulated Travel Mug',
      tag: 'Eco-Friendly',
      prompt: 'Double-walled vacuum insulated stainless steel coffee travel tumbler, 16oz, leakproof lock, 12h cold/8h hot retention, geared towards eco-conscious students.',
      result: `Headline: Hot Coffee. Cold World. Zero Leaks.

Ditch the disposable cups and elevate your daily grind with the Terra Insulated Travel Mug. Engineered from double-walled pro-grade stainless steel, this 16oz travel mug keeps your beverage at peak performance temperature from the morning lecture to your evening study session.

Key Benefits:
- Thermal Lock Insulation: Advanced double-walled vacuum sealing keeps coffee piping hot for up to 8 hours or iced brew frosty cold for up to 12 hours.
- 100% Leakproof Security: The heavy-duty trigger-lock lid secures your drink. Put it in your backpack next to your tablet with total confidence.
- Single-Handed Operation: Ergonomically crafted body contours fit standard vehicle and transit cupholders perfectly, with a rapid one-click trigger button.
- Clean Savoring Guarantee: BPA-free, premium food-grade 18/8 stainless steel that never rusts and never transfers metallic coffee tastes.

Sizing & Fit:
Holds 480ml (16oz) of liquid. Fits standard automotive cup holder wells. Top-rack dishwasher safe for hassle-free sterilizing.

SEO Snippet:
Shop the ultimate leakproof 16oz reusable coffee travel mug. The Terra double-walled vacuum stainless steel tumbler preserves hot beverages for 8 hours and fits snugly in commuter backpacks.`
    }
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

  persona: [
    {
      title: 'Skincare Niche: Eco-Conscious Professional',
      tag: 'Skincare',
      prompt: 'Premium organic anti-aging serum targeting busy working mothers in their late 30s.',
      result: `## Persona: "Mindful Marie" — The Conscious Overachiever

**Tagline:** "Effortless beauty that aligns with my values and fits my schedule."

**Demographics:**
- Age: 38
- Income: $95,000/year (USD)
- Occupation: Marketing Director

**Core Desires & Emotional Drivers:**
- Wants to reverse visible skin exhaustion & fine lines caused by stress and sleep deprivation.
- Desires luxury self-care rituals that have zero synthetic ingredients or toxic burden on her body.
- Demands high efficacy backed by clinical safety studies, rather than vague marketing hype.

**Main Objections & Trust Hurdles:**
- "Does organic actually deliver real, visible cellular anti-aging, or is it just pleasant oils?"
- Time starvation: She cannot commit to a complex 10-step skincare schedule.
- High skepticism of greenwashing; she reads full ingredient decks.

**Tested Direct Ad Hooks:**
1. "The anti-aging active that dermatologist studies prove outperforms chemical retinol (without clinical irritation or flaking)."
2. "To the mom waking up at 5:00 AM: Here is how to erase skin exhaustion in 12 seconds flat."
3. "Is your skincare working as hard as you do? Stop wasting morning routines on watered-down synthetics."`
    },
    {
      title: 'Eco-Home Niche: Zero-Waste Parent',
      tag: 'Eco-Home',
      prompt: 'Reusable organic beeswax food wraps targeting eco-conscious parents in their late 20s.',
      result: `## Persona: "Zero-Waste Zoe" — The Eco-Minimalist Parent

**Tagline:** "Keeping food fresh shouldn't mean choking the oceans with single-use plastic."

**Demographics:**
- Age: 29
- Income: $68,000/year (USD)
- Occupation: Content Strategist

**Core Desires & Emotional Drivers:**
- Desperately wants to eliminate single-use plastics from her kitchen to set a positive example for her children.
- Values aesthetic home organization (enjoys clean designs and natural patterns in the kitchen).
- Desires organic preservation methods that keep dynamic food fresh longer without artificial coatings.

**Main Objections & Trust Hurdles:**
- "Are they difficult to wash or maintain between messy toddler meals?"
- "Do they leaving a sticky residue on glass bowls or fresh bread?"
- "Will they actually create a airtight protective seal, or is cling wrap superior?"

**Tested Direct Ad Hooks:**
1. "The simple kitchen swap that replaces 20 rolls of traditional plastic cling wraps."
2. "How to keep half-cut apples and fresh bread fresh up to 3x longer using pure forest beeswax wraps."
3. "Ditch the plastic guilt. Wrap, wash, and reuse these premium hand-patterned organic cotton kitchen sails."`
    }
  ],

  'seo-meta': [
    {
      title: 'Orthopedic Sleep Pillows',
      tag: 'Bedding',
      prompt: 'Ergonomic solid memory foam pillows targeting side sleep neck pain wellness.',
      result: `**Page Title:** Ergonomic Memory Foam Pillow for Side Sleepers & Neck Pain Relief | SomnaLine

**Meta Description:** Wave goodbye to neck stiffness. Sleep deep with our certified solid memory foam ergonomic pillow engineered for optimal spine alignment. Free express delivery today!

**High-Intent Shopify Search Tags:**
1. ergonomic-sleep-pillow
2. side-sleeper-foam-support
3. neck-pain-relief-bedding
4. memory-foam-pillow-orthopedic
5. spine-alignment-sleeping
6. chiropractic-pillow-certified
7. premium-sleeper-bedding
8. somnaline-sleep-products
9. organic-washable-pillow-covers
10. cervical-contour-therapy-pillow`
    },
    {
      title: 'Organic Baked Dog Treats',
      tag: 'Pet Supplies',
      prompt: 'Grain-free hypoallergenic peanut butter baked dog snacks certified organic USDA healthy skin coat.',
      result: `**Page Title:** Organic Grain-Free Peanut Butter Dog Treats | BarkBites Pet Health

**Meta Description:** Treat your pup to the absolute best. Our USDA certified organic grain-free peanut butter dog biscuits promote smooth digestion and a lush, shiny coat. Shop our premium baked selection now!

**High-Intent Shopify Search Tags:**
1. organic-dog-treats
2. grain-free-dog-snacks
3. peanut-butter-dog-bites
4. hypoallergenic-puppy-biscuits
5. usda-certified-pet-treats
6. dog-digestion-healthy-snacks
7. premium-baked-dog-pet-food
8. natural-omega3-dog-biscuit
9. clean-label-dog-supplements
10. healthy-pet-skin-coat-chews`
    }
  ],

  'offer-builder': [
    {
      title: 'French Press & Mug Set Bundle',
      tag: 'Coffee store',
      prompt: 'Premium copper insulation French press. Unit price is $45.',
      result: `**Core Concept:** The ultimate "Barista-at-Home" premium brewing vault, upgrading morning coffee into an elite aroma experience.

**Bundle Structure:**
- *Tier 1 (The Single Starter):* Copper French Press + 1 Free Sample Arabica Pack — $45
- *Tier 2 (The Complete Vault):* Gourmet Companion Pack (French Press + 2 Double-Walled Glass Mugs + 250g Single-Origin Harvest Roast) — Only $69 (Value $95)
- *Tier 3 (Double-Down VIP):* 2x French Press Master Sets (One for home, one for the office) — Only $79 (Value $110 - Limit 50 orders)

**The Irresistible Bonus:**
- FREE digital PDF "The Golden Ratio: Master Coffee Brewing at Home" compiled by award-winning baristas (Value $19).
- Custom precision ground-coffee scoop with integrated bag-sealer clip.

**Risk Reversal Guarantee:**
- "Love your morning brew or it's free." 100-Day Satisfaction Shield: If your coffee isn't richer, send it back for a full refund. We pay the return shipping.

**High-Urgency Scarcity Trigger:**
- "Only 120 sets of hand-polished copper are available for this season's batch. Due to roasting restrictions on our limited micro-lot beans, this batch will close tonight at midnight."`
    },
    {
      title: '3-in-1 Fast Wireless Charger',
      tag: 'Electronics',
      prompt: '3-in-1 fast wireless charging stand for smartphone, watch, and airpods. Unit price is $59.',
      result: `**Core Concept:** The ultimate "Unclutter Your Nightstand" fast wireless power hub, eliminating messy cord nests forever.

**Bundle Structure:**
- *Tier 1 (The Nightstand Essential):* 1x 3-in-1 Fast Charging Dock + 18W QC Adapter — $59
- *Tier 2 (The Power Coupled Duo):* His & Hers Nightstand Pack (2x 3-in-1 Wireless Charging Stands + 2x Fast Adapters) — Only $99 (Save $19 + Free Shipping)
- *Tier 3 (Executive Office Upgrade):* 3x Stands (Home, Office, Travel pack) — Only $129 (Save $48 - Ultimate Productivity Package)

**The Irresistible Bonus:**
- FREE 2-Year Warranty Extension against any technical failures (Value $15).
- Premium braided 5ft Nylon USB-C Connection cable.

**Risk Reversal Guarantee:**
- "Try it on your desk risk-free for 60 days. If you still see a tangle of wires on your nightstand, send it back for a 100% immediate refund. No questions, no hassle."

**High-Urgency Scarcity Trigger:**
- "Due to current microchip supply levels, we have only 150 charging stations back in stock for this week's shipment. Limit 2 bundles per household."`
    }
  ],

  'customer-support': [
    {
      title: 'Lost Shipment Delivery Delay',
      tag: 'Logistics',
      prompt: 'A customer named Jessica is complaining that her order is 5 days late7 and hasn\'t arrived. She wants a refund.',
      result: `Dear Jessica,

First and foremost, I am incredibly sorry for the frustration this delay has caused. I completely understand how disappointing it is to wait for your package only to have the courier tracking stall. Your time is valuable, and this is certainly not the standard of service we aim to provide.

While our tracking system shows a temporary customs processing holding pattern on your package, we want to make this perfectly right for you immediately. 

To resolve this right now, we can offer you two solutions:
1. **Immediate Reshipment:** We can ship a brand new, prioritized package to your doorstep immediately via DHL Express (fully covered at our expense).
2. **Premium Store Credit + Bonus:** We can issue a complete refund in store credit plus an extra 15% bonus credit (Total: [Insert Price + 15%] to spend on any items), and you still get to keep the original package once it finally arrives!

Please let me know which of these options you prefer, and I will process it for you in under 10 minutes.

Warmest regards,

[Brand Support Team]`
    },
    {
      title: 'Defective Product Complaint',
      tag: 'Quality',
      prompt: 'A customer named Robert received a wireless charger that stopped working after 2 days. He is extremely angry.',
      result: `Dear Robert,

I am incredibly sorry to hear that your fast-wireless charger stopped working after just two days. I completely share your frustration—when you purchase a premium tech accessory, you expect it to work flawlessly right out of the box. Having it fail on day two is unacceptable, and I sincerely apologize for the inconvenience this has caused.

Please rest assured that we are taking absolute responsibility for this. You do not need to worry about packing up the defective charger or paying for any return shipping labels. 

To resolve this for you immediately, please choose one of the following options:
1. **Prioritized Express Replacement:** I can ship a brand new, triple-tested charger out to you today via 2-day express shipping (completely free of charge).
2. **Complete 100% Refund:** I can issue a full immediate refund back to your original payment method. 

Which option works best for you? Simply reply to this email, and I will make it happen in under 5 minutes.

With our sincerest apologies,

[Brand Support Team]`
    }
  ],

  'influencer-pitch': [
    {
      title: 'Fitness Bands Outreach',
      tag: 'Fitness',
      prompt: 'Unbreakable latex fabric resistance resistance bands with high-grip targeting core athletic fitness models on Instagram.',
      result: `### 🚀 Instagram/TikTok DM Pitch
Hey [Creator_Name]! Just saw your killer leg-day workout reel — the form was absolute perfection. 🔥 

We just launched a line of Unbreakable Latex Fabric Grip Bands engineered specifically to solve rolling and snapping during heavy resistance routines. We'd love to slide 1 premium set into your activewear rotation—completely free. No strings attached. 

If you are open to putting them to the test, drop your best shipping address below!

---

### 📩 Gifting & Compensation Follow-Up Email
**Subject:** Free Gifting: Premium Unbreakable Resistance Bands for [Creator_Name] 🏋️‍♀️

Hi [Creator_Name],

It’s exciting to connect! I'm reaching out from the PR & Creative team here at [Brand_Name] because our trainers are absolute fans of your fitness-first content and overall vibes.

Your intense workout tutorials are a perfect match for our new **Unbreakable Fabric Grip Bands**. Traditional rubber bands slip, pinch, and snap mid-workout; ours use dual-layer latex fabric weaves designed to stay locked around your knees without a single inch of shifting, guaranteed.

We would love to gift you our **Complete Master Grip Band Box** (Retail value $65) to test out! 
Here is our standard creator setup:
1. **The Gift:** 100% complimentary box, personalized custom carry case.
2. **Creative Independence:** No scripts or forced actions. Just share your honest thoughts on your story/reels if you genuinely fall in love with them.
3. **VIP Affiliate Link:** We will generate a unique co-branded code for your audience, providing a 15% commission to you on every conversion tracked.

If you'd like us to lock your package in, just reply back with:
- **Your Preferred Color Theme (Slate, Rose, or Onyx)**
- **Your Best Shipping Address & Phone Number (for DHL delivery alert)**

We look forward to collaborating!

Best,
[Your Name]
Ecom Creator Director

---

### 📋 Custom Creative Brief Guide
**Core Deliverables:** 1x Instagram Reel / TikTok Short (Up to 45 seconds).

**✅ The DOs:**
- Show the band close-up showing the non-slip fabric inner grip technology.
- Record a high-energy live demonstration showing a high-impact movement (squats, kickbacks, side-walks) where bands notoriously slide.
- Mention the "No-Snap, 100-Day Shield" policy in your voiceover.

**❌ The DONTs:**
- Do not mention or display competitor fitness brands.
- Avoid low-light bedroom backgrounds; shoot in well-lit gym or vibrant home functional setups.`
    },
  ],

  'angle-generator': [
    {
      title: 'Matcha Tea Powder',
      tag: 'Drinks',
      prompt: 'Organic culinary ceremonial grade Japanese matcha. Competitor weakness: bitter taste, clumpy mixing, lack of energy focus.',
      result: `### 🎯 Marketing Angle 1: Us vs Them (The Culinary Clarity Angle)
**The Hook:** Stop drinking "grassy" bitter matcha that requires a heap of sugar to swallow.
**Detailed Concept:** Focus heavily on the hand-picked, stone-ground ceremonial shadow crops from Uji, Japan versus mass-industrial machine-harvested cheap green teas. 
**Visual Storyboard:** Show standard cheap matcha in a cup looking yellow-brown, clumpy, and bitter. Next to it, show our matcha displaying a vibrant, glowing jade-green froth that blends beautifully into smooth, creamy velvet.
**Primary Pain Point addressed:** Texture clumpiness and awful bitter profile of low-grade offerings.

---

### 🎯 Marketing Angle 2: Status & Energy Upgrade (The Sustained Clean Power Angle)
**The Hook:** Delete the jittery 3:00 PM coffee crash. Clean energy is green, not brown.
**Detailed Concept:** Contrast the sudden spiked anxiety and cortisol crash of coffee drinks with the smooth L-Theanine sustained focus boost of premium matcha. Sell the identity of the super-productive, highly calm, non-jittery creative professional.
**Visual Storyboard:** A split-screen of an overworked developer shaking with coffee jitters vs a chilled, crisp creative sipping iced matcha with absolute flow state serenity.
**Primary Pain Point addressed:** Anxiety, mid-day crash, and restless heart racing.

---

### 🎯 Marketing Angle 3: Flawless Technical Deconstruction (The Purity Proof Angle)
**The Hook:** Read the label on your matcha before you whisk it.
**Detailed Concept:** Deconstruct the chemical composition. Detail the high chlorophyll concentration achieved through our 30-day shade-grown cover technique, forcing the plant to pump massive amounts of amino acids into the leaves. Zero heavy metals, Lead-tested certified organic.
**Visual Storyboard:** Rich cinematic closeups of shaded tea leaves under heavy canopies, and laboratory clean-room certificate of purity.
**Primary Pain Point addressed:** Chemical purity concerns, sourcing transparency, micro-ingredient levels.`
    }
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
  'scale-projection': [
    { title: 'Core Paid Scaling', values: { adBudget: '15000', cpc: '1.20', conversionRate: '2.5', avgOrderValue: '75' } },
    { title: 'High Volume Scale Test', values: { adBudget: '50000', cpc: '0.90', conversionRate: '1.8', avgOrderValue: '60' } },
  ],
};
