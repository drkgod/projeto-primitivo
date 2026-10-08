# Radar Primitivo — pasta do cliente

Pacote operacional da Fase 1, montado e validado em 08/10/2026.

**Repositório privado:** [drkgod/projeto-primitivo](https://github.com/drkgod/projeto-primitivo) · branch `main`.

O objetivo é configurar o perfil de cliente, descobrir empresas por fontes autorizadas, calcular a nota, buscar decisores pela Apollo dentro do teto e apresentar a fila diária no app do Skip.

## Por onde começar

A primeira entrega é uma versão visual navegável de Meu dia, Ficha da empresa e Perfis de busca, com dados fictícios. O Maestro aplica as skills de UI/UX já instaladas, registra seu uso e demonstra desktop/celular antes da conexão com dados reais. Veja a SPEC-1-008.

1. Leia [STATUS.md](STATUS.md).
2. Abra [as tasks da fase atual](04_fase-atual/fase.md): 27 tasks principais e 30 subtarefas. Os 54 cards existentes mantêm seus metadados; os três cards visuais novos aguardam UUID do portal e definição de prazo.
3. Consulte [o índice das 8 SPECs](04_fase-atual/specs/00-INDICE.md) e a SPEC da task antes de alterar o app.
4. Execute uma task por vez, rode as provas da SPEC e registre as evidências em '05_entregas/fase-1/SPEC-1-00N/'. Marque a task como concluída somente após a prova e o teste humano aplicável.

## Estrutura

| Caminho | Uso |
|---|---|
| '04_fase-atual/fase.md' | Tasks da Fase 1 com IDs e hierarquia do portal |
| '04_fase-atual/specs/' | Índice e oito SPECs, critérios de aceite e TDD |
| '05_entregas/' | Evidências de execução e testes |
| '06_notas/' | Decisões e dúvidas da operação |
| '07-sistemas/' | Código, migrações, hooks e testes do app |
| 'STATUS.md' e 'changelog.md' | Estado e histórico operacionais |

O [Projeto Greenexta](07-sistemas/README.md) está vinculado como submódulo em `07-sistemas/projeto-greenexta-2n35968qi/`. Para carregar o código após clonar este repositório, execute `git submodule update --init --recursive`.

## Pré-condições da execução

- Acesso ao Skip e ao Maestro e e-mails dos usuários.
- Escolha do primeiro perfil, critérios e exemplos de empresas.
- Plano Apollo com API, chave no cofre e teto de créditos aprovados.
- Fontes de empresas e direito de uso aprovados; SIPEAGRO + Apollo são a proposta a confirmar.
- Regras de acesso, retenção e não contato aprovadas; cópia restaurada em teste antes de contatos reais.
- Baseline de pesquisa e capacidade diária informados.

Os prazos originais de 06/10 a 20/10/2026 foram preservados. A publicação do pacote não comprova execução, contratação de integrações ou aprovação de dados reais. Tasks e SPECs desta fase são sincronizadas pelo repositório operacional.
