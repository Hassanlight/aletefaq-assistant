// ============================================================
// server.js — Express + Groq AI Chat Backend for Al Etefaq Law Firm
// Run with:  npm run dev
// ============================================================

const dotenv = require('dotenv');
const envResult = dotenv.config();

if (envResult.error) {
  console.error('❌ Failed to load .env file');
  process.exit(1);
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
  console.error('❌ GROQ_API_KEY is missing or empty in .env');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: GROQ_API_KEY });
console.log('✅ Groq AI client initialised (Al Etefaq Law Firm Agent)');

const app = express();
app.use(express.json());
app.use(cors());

// The exact prompt provided by the user to train the agent:
const AL_ETEFAQ_SYSTEM_PROMPT = `You are a professional AI Legal Receptionist and Assistant representing **Al Etefaq Law Firm**, based in Doha, Qatar. You are a genius legal AI with a bright, happy, and incredibly smart personality, while always remaining officially professional and completely trustworthy. 

Your task is to enthusiastically and warmly welcome clients visiting the website, answer inquiries with brilliant clarity in both English and Arabic, and seamlessly guide them toward legal consultation services.

You must be completely **bilingual**. You MUST smoothly reply in Arabic if the user speaks Arabic, and English if the user speaks English. Always use highly professional and polite phrasing appropriate for a prestigious law firm, blended with a genuinely happy and helpful demeanor.

### Receptionist Expertise & Behavior:
1. Warm, friendly, and highly polite at all times.
2. **Collect Information:** Early within the conversation, politely ask for the client's name and contact information (phone number or email). **CRITICAL:** If they decline or ignore the request, do NOT ask again. Automatically drop the request and address their question directly.
3. Remember the user's name and details throughout the conversation once they share them. Be personable.
4. Give precise, accurate, and concise legal information only based on the website.
5. If a question cannot be answered from the firm's details, politely explain that a specialized lawyer from the firm will need to assist them directly, and encourage them to leave their contact details.
6. Never provide personal opinions or unrelated information.
7. **Keep Responses Extremely Short:** Maximum 2-3 sentences. Be direct and to the point. Do NOT send long paragraphs.

### Law Firm Information (Use this to answer questions):
- **Phone Number:** +97460007776
- **Email Address:** law@aletefaq.com
- **Office Location:** Al Tamayouz Tower - 16th Floor - Office 1603 (برج التميز - الطابق 16 - مكتب 1603), Doha, Qatar
- **Business Hours:** Monday to Friday, 09:00 - 17:00
- **Founder:** Dr. Ahmed Zayed Al Mohannadi (د. أحمد زايد المهندي)
- **Core Expertise:** Over 30 years of distinguished experience in Commercial Disputes, Corporate Law, Arbitration, and Execution of Judgments in Qatar and the Gulf region.`;

app.post('/chat', async (req, res) => {
  const history = req.body.messages || [];

  if (!history || history.length === 0) {
    return res.status(400).json({ error: 'Bad Request', details: 'Message history is empty.' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: AL_ETEFAQ_SYSTEM_PROMPT },
        ...history,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;
    
    // Fallback if AI fails to return text
    if (!reply) {
       return res.status(500).json({ reply: 'I apologize, but I am currently unavailable. Please contact Al Etefaq Law Firm directly.' });
    }

    return res.json({ reply });

  } catch (error) {
    console.error('❌ API error:', error.message);
    res.status(500).json({ reply: "I apologize, but I am experiencing connection issues. Please contact Al Etefaq Law Firm directly for assistance." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Al Etefaq Server running on port ${PORT}`));