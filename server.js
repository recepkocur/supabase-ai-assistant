import dotenv from "dotenv";

dotenv.config();

// API Key kontrolü için log ekleyelim
console.log("OPENAI_API_KEY:", {
  exists: !!process.env.OPENAI_API_KEY,
  length: process.env.OPENAI_API_KEY?.length,
});
console.log("API_SECRET:", {
  exists: !!process.env.API_SECRET,
  length: process.env.API_SECRET?.length,
});

import OpenAI from "openai";
import express from "express";

const app = express();
app.use(express.json());

// En üstteki middleware'ler arasına ekleyin
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      body: req.body,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
});

// Timeout middleware
app.use((req, res, next) => {
  const timeout = 60000; // 60 saniye
  req.setTimeout(timeout);
  res.setTimeout(timeout);
  next();
});

// Secret doğrulama middleware'i
const validateApiSecret = (req, res, next) => {
  const apiSecret = req.headers["x-api-secret"];

  if (!apiSecret || apiSecret !== process.env.API_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post(
  "/trigger-ai-assistant/generate",
  validateApiSecret,
  async (req, res) => {
    const { name, prompt, model } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: model || "gpt-4o",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: name,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
      });

      const message = response.choices[0].message.content.trim();
      res.json({ message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

const PORT = process.env.PORT || 7102;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
