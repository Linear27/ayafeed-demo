
type GeminiChatMessage = { role: 'user' | 'model'; text: string };

const CHAT_ENDPOINT = '/api/public/chat';
const FALLBACK_MESSAGE = '🙇‍♀️ 抱歉，连接服务器时遇到点麻烦。';

export const sendMessageToGemini = async (
  history: GeminiChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history,
        newMessage,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return payload?.message || FALLBACK_MESSAGE;
    }

    const payload = await response.json();
    return typeof payload?.text === 'string' && payload.text.trim().length > 0
      ? payload.text
      : FALLBACK_MESSAGE;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return FALLBACK_MESSAGE;
  }
};
