# Aprovação da fonte — cadastro público do MAPA (SIPEAGRO/Fertilizantes)

Data: 26/10/2026, 12:05 (BRT) · Task 8f422530 · CL-PEND-003 RESOLVIDA

## Decisão do champion (Leonardo Motta Berzaghi)

Mensagem literal no canal web: “Pode usar o cadastro público do Ministério da Agricultura como primeira fonte. Mantenha o CNPJ parcialmente escondido e a atribuição na origem. Aplique a nota de prioridade do ICP v2 com corte 6 para separar os melhores. Siga o ciclo”

## O que foi registrado na fonte (fontes/tipo=sipeagro)

- aprovada: true · aprovada_em: 26/10/2026 12:05Z
- termo_uso: aprovado pelo Leonardo; CNPJ parcialmente escondido mantido como veio; atribuição ao MAPA na origem; licença Creative Commons Attribution
- config.url: https://dados.agricultura.gov.br/dataset/52a01565-72d6-410e-b21b-64035831a7be/resource/e0bbc9d5-f161-448b-a6d4-c7beb312ec33/download/sipeagrofertilizante.csv
- config.atribuicao: Ministério da Agricultura e Pecuária — SIPEAGRO (dados.agricultura.gov.br)
- config.mapeamento: RAZAO_SOCIAL/CNPJ/MUNICIPIO/UF/STATUS_DO_REGISTRO/ATIVIDADE · separador ; · utf-8 · download_via_navegador: true

## Nota sobre “ICP v2 com corte 6”

O perfil ativo é a versão 2 (aprovada em 22/10, “Perfil confere”). O corte 6 da matriz v1 equivale a 60% do máximo (11 pontos) — a faixa B já começa em 55% e a faixa A em ~64%. O cálculo implementado compara o percentual da nota com os limites das faixas do perfil ativo, o que equivale ao corte 6 e continua válido se os pesos mudarem.

## Primeira execução com dados reais do leiaute do MAPA

Lote de 6 linhas no leiaute oficial: 3 novas empresas + 1 atualizada (registro repetido) + 2 inválidas com motivo (1 conta excluída — MODARC variação de nome reconhecida — e 1 sem razão social). CNPJ mascarado preservado. Origem com fonte e data de coleta. Suíte completa 27/27.
