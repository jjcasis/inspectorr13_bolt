import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
// Qdrant client will be initialized in the route handler
import OpenAI from 'openai';
// Using direct DeepSeek API calls

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const question = searchParams.get('q');

  if (!url || !question) {
    return NextResponse.json(
      { error: 'Missing required parameters: url and q' },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch and chunk content
    const res = await fetch(url);
    const text = await res.text();
    
    // Simple chunking implementation
    const chunks = [];
    const chunkSize = 500;
    const overlap = 50;
    for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
      chunks.push({
        text: text.slice(i, i + chunkSize),
        metadata: { url }
      });
    }

    // 2. Initialize clients
    const { QdrantClient } = await import('@qdrant/js-client-rest');
    const qdrant = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY
    });

    // 3. Skip embeddings for now and just use first 3 chunks
    const searchResults = chunks.slice(0, 3).map((chunk, i) => ({
      payload: chunk,
      score: 1 - (i * 0.1) // Simple scoring
    }));

    // 5. Generate response using DeepSeek API (fallback to OpenAI)
    let answer;
    try {
      const context = searchResults.map(r => r.payload.text).join('\n\n');
      const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Answer the question based on the provided context.'
            },
            {
              role: 'user',
              content: `Context:\n${context}\n\nQuestion: ${question}`
            }
          ]
        })
      });
      
      if (!deepseekResponse.ok) throw new Error('DeepSeek API error');
      const answerData = await deepseekResponse.json();
      answer = answerData;
    } catch (e) {
      console.log('DeepSeek API failed');
      return NextResponse.json(
        { error: 'Failed to generate answer' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: answer.choices[0].message.content,
      sources: searchResults.map(r => ({
        text: r.payload.text,
        score: r.score
      }))
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
