import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, icp, style, keywords, creativity = 0.7 } = await req.json();
    if (!topic || !icp || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = `You are a research agent for an AI blog generator. Given a topic, ICP (ideal customer profile), style, and keywords, search the web and return a JSON object with the following fields: title (string), main_keyword (string), and key_points (array of strings).`;
    const userPrompt = `Topic: ${topic}\nICP: ${icp}\nStyle: ${style}\nKeywords: ${keywords?.join(', ') || ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 512,
      temperature: creativity,
    });

    const content = completion.choices[0]?.message?.content;
    let result;
    try {
      result = JSON.parse(content || '{}');
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
} 