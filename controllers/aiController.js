// controllers/aiController.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ضع مفتاحك في ملف .env
});

exports.handleAIRequest = async (req, res, pool) => {
  try {
    const userInput = req.body.prompt;

    if (!userInput) {
      return res.status(400).json({ error: "يرجى إرسال prompt في الطلب" });
    }

    // استدعاء نموذج الذكاء الاصطناعي
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // نموذج سريع ودقيق
      messages: [{ role: "user", content: userInput }],
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0].message.content;

    // تخزين الطلب والرد في قاعدة البيانات
    const result = await pool.query(
      'INSERT INTO ai_requests (prompt, reply, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [userInput, aiResponse]
    );

    const requestId = result.rows[0].id;

    res.json({ requestId, prompt: userInput, reply: aiResponse });
  } catch (err) {
    console.error("AI Controller Error:", err);
    res.status(500).json({ error: "خطأ في السيرفر أو قاعدة البيانات" });
  }
};