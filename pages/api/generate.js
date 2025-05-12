export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, appearance, personality } = req.body;

  const prompt = `
다음 정보를 바탕으로 매력적인 가상 캐릭터를 만들어줘:
- 이름: ${name}
- 외모: ${appearance}
- 성격: ${personality}
[출력]
1. 캐릭터 소개 (3줄)
2. 성격 요약
3. 명대사`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: data.error.message || 'OpenAI API error' });
    }
  } catch (error) {
    res.status(500).json({ error: '서버 오류 발생: ' + error.message });
  }
}
