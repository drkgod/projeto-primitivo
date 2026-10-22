# Análise — SPEC-1-004: fundação da descoberta (fase 1 da SPEC, sem Apollo e sem fonte aprovada)

Data: 22/10/2026 · Ciclo contínuo · Decisão do champion (19:01): Apollo ADIADA (assessor/orçamento); app em MODO DE SIMULAÇÃO; capacidade confirmada 1/dia·5/sem.

## Escopo desta rodada (o que não depende de Apollo nem de aprovação de fonte)

- Coleções da SPEC: fontes, execucoes, empresas, empresa_origens, revisoes_fusao (migração 0007).
- Fontes iniciais registradas NÃO aprovadas (0008) — a aprovação real é a task 8f422530 do champion (URL exata + termo de uso + cadência).
- Superusuário de teste (0009, só no 64536) para os testes dirigirem a rotina sem afrouxar regras.
- Hook processa-lote-descoberta: RN-01 (UF fora do perfil, situação inativa, conta excluída → inválido com motivo), RN-02 (consolidação por nome normalizado+UF com divergências e aliases), RN-03 (mesmo nome+UF com município diferente → revisão pendente, sem fundir sozinho), CA-1-16 (CNPJ mascarado preservado em cnpj_mascarado; cnpj vazio).

## O que fica para as próximas rodadas

- Rotina agendada descoberta_diaria (cron 08:00 UTC dias úteis) — SÓ após aprovação da fonte.
- Tela Fontes e execuções, Revisão de fusões, Ficha mínima da empresa.
- Planilha/manual com motivo (RN-06); falha de fonte (RN-07); desfazer execução.
- Rota apollo_organizacoes — bloqueada pela decisão do champion (assessor/orçamento).

## TDD desta rodada

- Fixture sipeagro-amostra.csv: 8 linhas — 4 novas, 1 repetida (→ 2 origens), 1 ambígua (→ revisão), 1 inativa, 1 sem razão social; CNPJs mascarados.
- RED: 4/4 falhando (coleções existiam, regra de negócio não). GREEN: 4/4. Suíte completa: 23/23 (descoberta 4 + perfis 8 + demo 11).

## Aprendizados (capturados nos APs)

- Hook em onRecordCreate que salva o próprio registro → recursão infinita; usar onRecordAfterCreateSuccess.
- id_na_fonte precisa incluir a execução (índice único fonte+id colide entre lotes).
- Superusuário de teste dirige a rotina (cria fontes/execuções) sem afrouxar as regras da SPEC.
- Token de teste no INÍCIO do nome preserva a remoção de sufixos (ltda) da normalização.

## Riscos

- Registros de teste acumulam no 64536 (deleteRule null) — tokens únicos por rodada isolam os lotes.
- A aprovação da fonte pelo champion precisa da URL exata do arquivo SIPEAGRO e do termo de uso — não aprovar por conta própria.
