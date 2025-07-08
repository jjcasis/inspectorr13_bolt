# Roadmap del Proyecto geo-optimization

## Resumen Técnico

**Objetivos Iniciales:**
- Sistema de recomendaciones basado en IA para optimización de contenido web
- Procesamiento de URLs con generación de sugerencias contextuales (DeepSeek)
- Búsqueda semántica con Qdrant
- API REST y CLI funcionales

## Cronograma Detallado

| Hito | Día | Descripción | Dependencias |
|------|-----|-------------|--------------|
| **Fase 1: Core** | Día 1 | - CLI básico<br>- Integración DeepSeek<br>- Chunking inicial | - DeepSeek API<br>- Node.js |
| **Fase 2: RAG** | Día 2 | - Endpoint Next.js `/api/ask`<br>- Integración Qdrant<br>- Scoring básico | - Qdrant local<br>- Next.js 15 |
| **Fase 3: Despliegue** | Día 3 | - Configuración Netlify<br>- Variables de entorno<br>- CI/CD básico | - Cuenta Netlify<br>- GitHub Actions |
| **Fase 4: Mejoras** | Día 4 | - Chunking HTML-aware<br>- Fine-tuning embeddings<br>- Cache de respuestas | - Qdrant Cloud<br>- DeepSeek fine-tuning |
| **Fase 5: Escalado** | Día 5 | - Load testing<br>- Monitoreo<br>- Auto-scaling | - New Relic<br>- Kubernetes |

## Próximos Pasos

1. Despliegue automatizado en Netlify (Día 3)
2. Sistema de logging centralizado (Día 4)
3. Autenticación API (Día 4)
4. Documentación Swagger (Día 5)

## Notas

- Cada fase corresponde a un milestone en GitHub Projects
- Las dependencias deben estar configuradas antes de cada fase
- El cronograma asume disponibilidad full-time (8h/día)
- Los días son consecutivos (sin fines de semana)
