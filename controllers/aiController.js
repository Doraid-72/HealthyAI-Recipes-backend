const { OpenAI } = require('openai');
const Content = require('../models/Content');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateRecipe = async (req, res) => {
  const { userId, query, language } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "أنت مساعد وصفات غذائية ذكي يقدم وصفات صحية." },
        { role: "user", content: `أعطني وصفة باستخدام: ${query}` }
      ]
    });

    const generatedText = response.choices[0].message.content;

    const newContent = new Content({
      title: query,
      type: "recipe",
      description: generatedText,
      language,
      created_by: userId
    });

    await newContent.save();

    res.json({ success: true, content: newContent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};