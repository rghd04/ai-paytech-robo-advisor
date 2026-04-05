import express, { response } from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});

import path from "path";

app.use(express.static(path.join(__dirname, "../dist")));

// test routeG
app.get("/", (req, res) => res.json({ ok: true }));

// OpenAI chat route
app.post("/chat", async (req, res) => {


  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    

const fintechKeywords = [
  "payment", "wallet", "bank", "card", "fraud", "gateway",
  "fintech", "transaction",
  "بطاقة", "دفع", "محفظة", "بنك", "احتيال"
];

const isFintech = fintechKeywords.some(keyword =>
  message.toLowerCase().includes(keyword)
);



    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input: message,
    });

    const reply = completion.output[0].content[0].text;

    res.json({ response: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

