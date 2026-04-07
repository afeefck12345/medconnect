const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    AI symptom checker — suggest specialist
// @route   POST /api/symptoms/check
// @access  Public
const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim() === '') {
      return res.status(400).json({ message: 'Please provide symptoms' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a medical assistant AI. A patient has described the following symptoms:
      "${symptoms}"

      Based on these symptoms:
      1. Give a brief possible condition (1-2 lines, not a diagnosis).
      2. Recommend the most suitable doctor specialization to consult.
      3. Give 2-3 general health tips.

      Respond in this exact JSON format:
      {
        "possibleCondition": "...",
        "recommendedSpecialist": "...",
        "healthTips": ["...", "...", "..."]
      }

      Important: Only return valid JSON. No extra text.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json({ symptoms, ...parsed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkSymptoms };