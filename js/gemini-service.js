import { ENV } from './env.js';

class GeminiService {
  constructor() {
    this.apiKey = ENV?.GEMINI_API_KEY || '';
    this.model = ENV?.GEMINI_MODEL || 'gemini-2.0-flash';
    this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  async callGemini(prompt, generationConfig = {}) {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    if (Object.keys(generationConfig).length) payload.generationConfig = generationConfig;

    const res = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${body}`);
    }

    return res.json();
  }

  // Generate blog content. Returns { success, data } where data is a parsed JSON object.
  async generateBlogContent(topic, keywords = []) {
    const prompt = `Create a blog post about "${topic}".${keywords.length ? ` Keywords: ${keywords.join(', ')}.` : ''}\n\nReturn ONLY a JSON object with these exact fields (no extra text):\n{\n  "title": "...",\n  "metaDescription": "...",\n  "content": "...",\n  "excerpt": "...",\n  "tags": ["..."],\n  "slug": "..."\n}`;

    try {
      const data = await this.callGemini(prompt, { temperature: 0.4, maxOutputTokens: 2048 });
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const jsonText = start !== -1 && end !== -1 ? text.substring(start, end + 1) : text;
      const cleaned = jsonText.replace(/[\u0000-\u0019]+/g, '').replace(/,(\s*[}\]])/g, '$1').trim();
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (err) {
      console.error('generateBlogContent error:', err);
      return { success: false, error: err.message };
    }
  }

  async generateSEOData(title, content) {
    const prompt = `Generate SEO metadata for this blog post:\nTitle: ${title}\nContent Preview: ${content.substring(0, 500)}...\n\nReturn ONLY valid JSON with fields: metaDescription, keywords (array), ogTitle, ogDescription.`;
    try {
      const data = await this.callGemini(prompt);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const jsonText = start !== -1 && end !== -1 ? text.substring(start, end + 1) : text;
      const cleaned = jsonText.replace(/[\u0000-\u0019]+/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (err) {
      console.error('generateSEOData error:', err);
      return { success: false, error: err.message };
    }
  }

  async testConnection() {
    try {
      const data = await this.callGemini('Say "Connected" if you can read this.');
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { success: true, message: 'Connected', response: text };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}


export default new GeminiService();


