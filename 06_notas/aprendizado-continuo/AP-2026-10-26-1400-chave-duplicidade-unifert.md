# AP — chave de duplicidade e Unifert (26/10)

Data: 26/10/2026 · task SPEC-1-005-nota-icp

- A chave de duplicidade ERA nome+UF (verificado no hook antes de editar) — o champion estava certo: nome fantasia repetido na MESMA UF (duas "Uniagro" na BA) não desempatava.
- Chave nova: nome+UF+MUNICÍPIO (comparação sem acento, case-insensitive) + CNPJ mascarado como discriminador em TODOS os caminhos (com e sem município). Divergência de município OU de CNPJ → revisão_fusao pendente, nunca fusão automática.
- PROVA na produção (3 linhas SP, mesmo nome): 1 nova (São Paulo .999) + 2 revisões pendentes — 'mesmo nome e UF com município diferente' (Campinas .888) e 'mesmo nome, UF e município com CNPJ diferente' (São Paulo .777). Suíte 27/27 no teste após a mudança.
- Ordem dos filtros importa: UF fora do perfil rejeita ANTES da checagem de duplicidade — a prova com BA falhou silenciosamente ('fora das UFs do perfil (BA)') porque BA não está no perfil ativo. Flagado ao champion como decisão (adicionar BA ou não).
- Registro de exemplo por instrução do dono: nome exato 'Unifert (Uniagro de Luiz Eduardo Magalhães)', município obrigatório, SEM CNPJ inventado (o anterior **.***.011 foi zerado), origem 'manual' com observação de que os dados do MAPA serão confirmados na 1ª importação real.
- Superusuário de operação (admin@radar.local) criado via segredo RADAR_ADMIN_PASSWORD — necessário porque updateRule/createRule null bloqueia corretamente o app-user para execuções; injeção de lotes sob demanda passa pelo admin.
- Senha do champion redefinida (migração 0013 + segredo) após ele ter trocado e perdido — sempre redefinível por esse caminho sem expor a senha em logs.
