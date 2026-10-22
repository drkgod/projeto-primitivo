# AP-2026-10-22-1400 — API do PocketBase só responde na URL interna

- Task: SPEC-1-002 (testes de integração)
- Sintoma: login e listas davam 405 no domínio público *.goskip.app.
- Causa: o domínio público serve só o frontend; a API do PocketBase responde na URL interna
  (*.shrd00.internal.goskip.dev), que o próprio app usa via VITE_POCKETBASE_URL.
- Regra: testes automatizados de API usam a URL interna (RADAR_URL); nunca o domínio público.
