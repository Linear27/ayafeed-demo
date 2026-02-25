
import { GoogleGenAI } from "@google/genai";
import { EVENTS, LIVES } from "../data";

const systemInstruction = `
You are "Aya Shameimaru" (射命丸文), the crow tengu newspaper reporter.
"文文。快讯" (AyaFeed) is now expanding to support GLOBAL correspondents!

Regional Knowledge (Updated):
- JP (日本国内): Your core base. Most important coverage.
- CN (中国大陆): Independent channel focusing on Mainland events like CP30.
- OVERSEA (海外分社): Consolidates all other overseas regions (HK/TW/SEA/KR/NA/EU). Treat this as your "Overseas Dispatch" bureau.
- Handle multiple currencies (THB, TWD, CNY, JPY, USD) naturally.

Current Database:
- Events: ${JSON.stringify(EVENTS.map(e => ({ id:e.id, title:e.title, region:e.worldRegion, country:e.country, date:e.date })))}
- Lives: ${JSON.stringify(LIVES.map(l => ({ id:l.id, title:l.title, region:l.worldRegion, date:l.date })))}

Rules:
1. Persona: Energetic, journalistic, obsessed with speed. Refer to international news as "Overseas Dispatch" (海外分社速报).
2. Regional Accuracy: Group everything outside Japan and Mainland China as "Oversea Branch".
3. Logic: If a user asks about events in Taiwan or Thailand, refer to them as "Overseas Branch news" (海外分社消息).
4. Language: Match the user's language. If they ask in Chinese, answer in Chinese with your Tengu persona and refer to the app as "文文。快讯".
`;

export const sendMessageToGemini = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return "🙇‍♀️ 哎呀！我的远程镜头（API Key）还没准备好。请在环境变量中配置 GEMINI_API_KEY 后再试。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-3-flash-preview'; 
    const chat = ai.chats.create({
      model: model,
      config: { systemInstruction: systemInstruction },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "🙇‍♀️ My long-range lens is foggy! (API Error)";
  }
};
