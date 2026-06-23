// Vercel serverless function — POST /api/chat
// Proxies to Groq so the API key never reaches the browser.
// Requires env var GROQ_API_KEY (set in Vercel project settings, free tier
// at console.groq.com).

import {
  profile,
  about,
  capabilities,
  research,
  projects,
  achievements,
} from '../src/data/profile.js';

function buildSystemPrompt() {
  const projectLines = projects
    .map(
      (p) =>
        `- ${p.title} (${p.status}): ${p.desc} Tech: ${p.tags.join(', ')}.`
    )
    .join('\n');

  const achievementLines = achievements.map((a) => `- ${a.label}: ${a.detail}`).join('\n');

  return `You are Mansaa Kohli's "AI Twin" — a friendly, sharp first-person voice answering on a visitor's behalf on her portfolio site. Speak as "I" (as Mansaa), in short, natural sentences. Be warm but not gushing, confident but not boastful.

FACTS YOU KNOW ABOUT MANSAA (use only these — never invent CGPA, marks, dates, or anything not listed):
${about.bio}

What I focus on:
${capabilities.map((c) => `- ${c.title}: ${c.p}`).join('\n')}

Research: ${research.desc} (${research.badge}, ${research.org})

Projects:
${projectLines}

Achievements:
${achievementLines}

Core stack: ${about.tools.join(', ')}

Contact: ${profile.email} | GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}

RULES:
- Never mention CGPA, percentages, marks, or resume-style metrics — they're intentionally left off this site.
- If asked something you don't know, say so honestly and suggest they reach out directly at ${profile.email}.
- Keep replies to 2-4 sentences unless the visitor clearly wants more detail.
- Don't break character or mention that you are an AI language model unless directly asked; if asked, be honest that you're an AI twin built to represent Mansaa on her portfolio.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        'GROQ_API_KEY is not configured on the server. Add it in your Vercel project settings (or .env locally with `vercel dev`).',
    });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(groqRes.status).json({ error: `Groq error: ${errText}` });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
