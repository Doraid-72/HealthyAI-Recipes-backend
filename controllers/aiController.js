// aiController.js
// هذا ملف تجريبي لمعالجة طلبات المستخدم عبر الذكاء الاصطناعي

exports.handleAIRequest = (req, res) => {
  try {
    const userInput = req.body.prompt; // المستخدم يرسل نص في body باسم prompt

    if (!userInput) {
      return res.status(400).json({ error: "يرجى إرسال prompt في الطلب" });
    }

    // هنا تضع منطق الذكاء الاصطناعي الحقيقي لاحقًا
    // الآن سنرجع رد تجريبي للتأكد أن السيرفر يعمل
    const aiResponse = `AI backend استقبل: "${userInput}" وتمت معالجته بنجاح`;

    res.json({ reply: aiResponse });
  } catch (err) {
    console.error("AI Controller Error:", err);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
};