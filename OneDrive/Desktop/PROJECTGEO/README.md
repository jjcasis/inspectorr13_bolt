# geo-optimization

Sistema de recomendaciones basado en IA para optimización de contenido web

## Resumen Técnico

**Objetivos:**
- Procesamiento de URLs con generación de sugerencias contextuales (DeepSeek)
- Búsqueda semántica con Qdrant
- API REST y CLI funcionales

**Tecnologías:**
- Node.js
- Next.js
- Qdrant
- DeepSeek API

## Roadmap

Ver [ROADMAP.md](ROADMAP.md) para el cronograma detallado

## Instalación

```bash
npm install
npm run dev
```

## Uso

CLI:
```bash
node src/cli/index.js --url [URL]
```

API:
```bash
curl "http://localhost:3000/api/ask?url=[URL]&q=[QUESTION]"
