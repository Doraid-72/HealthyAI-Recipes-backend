const express = require("express");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

// إعداد الاتصال مع Supabase
const supabaseUrl = "https://YOUR_PROJECT.supabase.co";
const supabaseKey = "YOUR_SERVICE_ROLE_KEY"; 
const supabase = createClient(supabaseUrl, supabaseKey);

// إعداد الاتصال مع OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 🟢 تسجيل مستخدم جديد
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword, role }]);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "تم إنشاء المستخدم بنجاح", user: data });
  } catch (err) {
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

// 🟢 تسجيل الدخول
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);
    if (error || users.length === 0) {
      return res.status(400).json({ error: "المستخدم غير موجود" });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    res.json({ message: "تسجيل الدخول ناجح", role: user.role });
  } catch (err) {
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

// 🟢 توليد وصفة غذائية وحفظها
app.post("/recipes", async (req, res) => {
  const { ingredients, dietType, username } = req.body;
  try {
    const prompt = `
    أنت خبير تغذية محترف. اكتب وصفة غذائية صحية باستخدام المكونات التالية: ${ingredients}.
    اجعل الوصفة مناسبة لنظام ${dietType}، واكتبها بطريقة احترافية وممتعة مع خطوات التحضير وفوائدها الصحية.
    `;
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const recipe = completion.data.choices[0].message.content;

    // حفظ الوصفة
    const { error } = await supabase
      .from("recipes")
      .insert([{ username, ingredients, dietType, recipe }]);
    if (error) console.error("خطأ في حفظ الوصفة:", error.message);

    res.json({ recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الاتصال بالذكاء الاصطناعي" });
  }
});

// 🟢 جلب وصفات المستخدم
app.get("/myrecipes/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("username", username)
      .order("id", { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ recipes: data });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب الوصفات" });
  }
});

// 🟢 حذف وصفة
app.delete("/myrecipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "تم حذف الوصفة بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في حذف الوصفة" });
  }
});

// 🟢 تشغيل السيرفر
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});