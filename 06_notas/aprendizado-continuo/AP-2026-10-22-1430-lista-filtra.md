# AP-2026-10-22-1430 — regra de lista do PocketBase FILTRA (200 + vazio), não rejeita 401

- Task: SPEC-1-002 (teste "anônimo não lista perfis")
- Sintoma: teste esperava 401 para anônimo; a API devolveu 200 com totalItems 0.
- Causa: regras de lista no PB filtram os registros; anônimo vê página vazia, não um erro.
- Regra: para provar proteção em lista, asserir totalItems = 0 (ou 403 em view/getOne).
- Extra: BadRequestError(data) normaliza valores não-ValidationError — a lista de faltantes
  legível vai no `message` da resposta, não em data.faltantes.
