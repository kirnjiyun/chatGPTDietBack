const OpenAI = require("openai");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

//에이피아이 키 가져오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
app.post("/chat", async (req, res) => {
    try {
        console.log(req.body);
        const { message, type } = req.body;

        if (!message || !type) {
            return res.status(400).json({ error: "안되네요" });
        }
        const typeDescription =
            type === "diet" ? "다이어트 식단 추천" : "다이어트 운동 방법 추천";
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `당신은 ${typeDescription} 전문가입니다.`,
                },
                { role: "user", content: message },
            ],
        });
        const reply = completion.choices[0].message;
        res.status(200).json(reply);
    } catch (error) {
        res.status(400).json({ error: "api request fail", rawError: error });
    }
});

app.listen(5000, () => {
    console.log("server is running on 5000");
});
