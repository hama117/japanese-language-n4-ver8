import OpenAI from 'openai';
import { Language, ExplanationResponse } from '../types';
import { languagePrompts } from './prompts';

const languageInstructions: Record<Language, string> = {
  ja: `
以下の日本語能力試験N4の問題について、日本語で詳しく説明してください：

1. 正解の説明
- なぜその答えが正しいのか
- 文法・語彙のポイント
- 実際の使用例

2. 不正解の説明
- なぜ他の選択肢が適切でないのか
- よくある間違いとその理由

3. 学習ポイント
- この問題から学べる重要な点
- 関連する文法・語彙
- 日常会話での使い方

必ず日本語で説明してください。`,

  en: `
Please explain this JLPT N4 question in English:

1. Correct Answer
- Why this answer is correct
- Grammar and vocabulary points
- Real-world usage examples

2. Incorrect Options
- Why other choices are not appropriate
- Common mistakes and their reasons

3. Learning Points
- Key points to learn from this question
- Related grammar and vocabulary
- Usage in daily conversations

Please ensure the explanation is in English.`,

  zh: `
请用中文详细解释以下日语能力测试N4的问题：

1. 正确答案说明
- 为什么这个答案是正确的
- 语法和词汇要点
- 实际使用例子

2. 错误选项说明
- 为什么其他选项不合适
- 常见错误及其原因

3. 学习要点
- 从这个问题中学到的重要内容
- 相关语法和词汇
- 日常对话中的使用

请务必用中文解释。`,

  vi: `
Vui lòng giải thích câu hỏi JLPT N4 này bằng tiếng Việt:

1. Đáp án đúng
- Tại sao đáp án này là đúng
- Điểm ngữ pháp và từ vựng
- Ví dụ sử dụng thực tế

2. Các lựa chọn sai
- Tại sao các lựa chọn khác không phù hợp
- Lỗi thường gặp và lý do

3. Điểm học tập
- Những điểm quan trọng cần học từ câu hỏi này
- Ngữ pháp và từ vựng liên quan
- Cách sử dụng trong hội thoại hàng ngày

Vui lòng đảm bảo giải thích bằng tiếng Việt.`,

  id: `
Mohon jelaskan pertanyaan JLPT N4 ini dalam Bahasa Indonesia:

1. Jawaban Benar
- Mengapa jawaban ini benar
- Poin tata bahasa dan kosakata
- Contoh penggunaan dalam kehidupan sehari-hari

2. Pilihan Yang Salah
- Mengapa pilihan lain tidak tepat
- Kesalahan umum dan alasannya

3. Poin Pembelajaran
- Poin penting yang dipelajari dari pertanyaan ini
- Tata bahasa dan kosakata terkait
- Penggunaan dalam percakapan sehari-hari

Pastikan penjelasan dalam Bahasa Indonesia.`,

  th: `
กรุณาอธิบายคำถาม JLPT N4 นี้เป็นภาษาไทย:

1. คำตอบที่ถูกต้อง
- เหตุใดคำตอบนี้จึงถูกต้อง
- จุดสำคัญด้านไวยากรณ์และคำศัพท์
- ตัวอย่างการใช้งานจริง

2. ตัวเลือกที่ไม่ถูกต้อง
- เหตุใดตัวเลือกอื่นจึงไม่เหมาะสม
- ข้อผิดพลาดทั่วไปและเหตุผล

3. จุดการเรียนรู้
- จุดสำคัญที่ได้เรียนรู้จากคำถามนี้
- ไวยากรณ์และคำศัพท์ที่เกี่ยวข้อง
- การใช้ในบทสนทนาประจำวัน

กรุณาอธิบายเป็นภาษาไทยเท่านั้น`
};

export async function getExplanation(
  questionType: string,
  question: string,
  context: string,
  userAnswer: number,
  correctAnswer: number,
  choices: string[],
  language: Language,
  apiKey: string
): Promise<ExplanationResponse> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const isCorrect = userAnswer === correctAnswer;
  const langPrompt = languagePrompts[language];

  const formattedChoices = choices
    .map((choice, index) => `${index + 1}. ${choice}`)
    .join('\n');

  const prompt = `${languageInstructions[language]}

問題の種類: ${questionType}
問題: ${question}
文脈: ${context}
選択肢:
${formattedChoices}
学習者の回答: ${userAnswer}
正解: ${correctAnswer}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: `You are a Japanese language teacher. Always provide explanations in ${language} language only.` 
      },
      { 
        role: "user", 
        content: prompt 
      }
    ],
    temperature: 0.3,
    max_tokens: 800,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  });

  return {
    isCorrect,
    explanation: `${isCorrect ? langPrompt.correct : langPrompt.incorrect}\n\n${response.choices[0]?.message?.content || ''}`,
  };
}