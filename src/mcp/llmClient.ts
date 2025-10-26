import fetch from "node-fetch";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export class LLMClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getResponse(messages: Message[]): Promise<string> {
    const url = "https://api.siliconflow.cn/v1/chat/completions";
    console.log(messages);
    const payload = {
      messages,
      model: "deepseek-ai/DeepSeek-V3",
      temperature: 0.7,
      max_tokens: 4096,
      stream: false,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM 请求失败: ${res.status} - ${errText}`);
    }

    const data = await res.json() as {
      choices: {
        message: {
          content: string
        }
      }[];
    };
    return data.choices[0].message.content;
  }
}
