#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// Configure CLI
const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'URL to analyze',
    required: true
  })
  .help()
  .argv;

// Carga variables de entorno
const envPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: envPath });

const fetch = require('node-fetch');

// 1) Verificar clave de API de DeepSeek
const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  console.error('❌ Falta DEEPSEEK_API_KEY en .env');
  process.exit(1);
}
console.log('🔐 DEEPSEEK_API_KEY begins with:', apiKey.slice(0,5));
console.log('🏁 Script iniciado');

async function callDeepSeekAPI(prompt) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Asistente experto en optimización de contenido web para LLMs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('Error details:', errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error('❌ Error calling DeepSeek API:', err);
    throw err;
  }
}

// 4) Función principal de análisis
async function analyzeWebsite(url) {
  console.log(`🔍 Analizando: ${url}`);
  try {
    // Extraer HTML
    const res = await fetch(url);
    const text = await res.text();

    // Mostrar un fragmento
    console.log('✅ Contenido extraído:', text.slice(0,200).replace(/\n/g,' ') + '…');

    // Chunkear el contenido (simple implementation)
    const chunks = [];
    const chunkSize = 500;
    const overlap = 50;
    
    for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    console.log(`📦 Generados ${chunks.length} chunks de ~${chunkSize} caracteres each`);

    // Construir prompt
    const prompt = `
Eres un experto en optimización de contenido web para modelos de lenguaje.
Genera 5 recomendaciones numeradas para que un LLM
entienda, cite y responda con precisión sobre este fragmento:

"""
${text.slice(0,2000)}
"""
    `.trim();

    // Llamar a la API de DeepSeek directamente
    const reco = await callDeepSeekAPI(prompt);
    
    if (reco.choices && reco.choices.length > 0) {
      console.log('💡 Recomendaciones de DeepSeek:\n', reco.choices[0].message.content);
    } else {
      console.error('❌ Respuesta inesperada de la API:', reco);
    }
  } catch (err) {
    console.error('❌ Error en analyzeWebsite:', err);
  }
}

// 5) Ejecutar con URL de CLI
analyzeWebsite(argv.url);
