# Changelog

Todos los cambios notables en este proyecto se documentan en este archivo.

## [Unreleased]
- Estructura inicial del proyecto (src/, scripts/, etc.)
- CLI funcional con DeepSeek y chunking
- Endpoint `/api/ask` con Qdrant y RAG
- Roadmap diario en ROADMAP.md
- Documentación CHANGELOG.md

## [0.1.0] - Día 1
### Added
- CLI básico que acepta `--url`
- Integración con la API de DeepSeek para recomendaciones
- Chunking de texto con `text-clip-splitter`
- Configuración inicial de Qdrant local

## [0.2.0] - Día 2
### Added
- Endpoint Next.js `/api/ask`
- Indexación y búsqueda en Qdrant usando `@qdrant/js-client-rest`
- Sistema de scoring básico para fragmentos
- Integración continua inicial

## [0.3.0] - Día 3
### Added
- Configuración de despliegue en Netlify (netlify.toml)
- CI/CD básico con GitHub Actions
- Variables de entorno para claves API
- Documentación técnica inicial

## [0.4.0] - Día 4
### Added
- Mejoras en chunking HTML-aware
- Cache de respuestas con Redis
- Fine-tuning de embeddings
- Sistema de logging centralizado

## [0.5.0] - Día 5
### Added
- Pruebas de carga con k6
- Monitoreo y alertas con New Relic
- Auto-scaling configurado
- Documentación Swagger para la API

### Changed
- Optimización del pipeline de embeddings
- Mejoras en el sistema de scoring
