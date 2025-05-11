import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      main_keyword,
      key_points,
      topic,
      icp,
      style,
      keywords,
      length = 'medium',
      seo = 'balanced',
      citations = 'when-needed',
    } = await req.json();

    if (!title || !key_points || !Array.isArray(key_points) || key_points.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid outline fields' }, { status: 400 });
    }

    const systemPrompt = `You are a professional blog writing agent for an AI blog generator. Write a complete, high-quality blog article in markdown format based on the provided outline, ICP, style, and keywords. Incorporate the key points, optimize for SEO, and include citations if needed. Use the following settings: Length: ${length}, SEO: ${seo}, Citations: ${citations}.`;
    const userPrompt = `Title: ${title}\nMain Keyword: ${main_keyword}\nKey Points: ${key_points.join(' | ')}\nTopic: ${topic}\nICP: ${icp}\nStyle: ${style}\nKeywords: ${(keywords || []).join(', ')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    return NextResponse.json({ article: content });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
} 