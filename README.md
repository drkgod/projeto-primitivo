# Radar Primitivo — pasta do cliente

Pacote operacional da Fase 1, montado e validado em 08/10/2026.

**Repositório privado:** [drkgod/projeto-primitivo](https://github.com/drkgod/projeto-primitivo) · branch `main`.

O objetivo é configurar o perfil de cliente, descobrir empresas por fontes autorizadas, calcular a nota, buscar decisores pela Apollo dentro do teto e apresentar a fila diária no app do Skip.

## Para Leonardo

Veja [seu projeto em palavras simples](04_fase-atual/para-leonardo.md). Você não precisa ler a documentação de construção para continuar ou pedir ajuda.

## Por onde o Maestro começa

Antes de responder ao Leonardo, seguir [o guia de conversa](.adapta-cliente/comunicacao-com-leonardo.md) e consultar as decisões e os aceites mais recentes. Não enviar códigos, siglas ou um formulário antigo ao cliente como condição para construir.

A entrega visual foi aprovada em 09/10 e os Perfis de busca em 22/10. O próximo recorte é continuar Fontes/execuções, revisão de cadastros repetidos e ficha da empresa (SPEC-1-004) com fixtures. Apollo real adiada; capacidade confirmada em 1/dia e 5/semana. Não cobrar novamente o ICP, a capacidade ou a contratação.

1. Leia [STATUS.md](STATUS.md).
2. Abra [as tasks da fase atual](04_fase-atual/fase.md): 27 tasks principais e 30 subtarefas. Os 57 cards mantêm os UUIDs conferidos; os três cards visuais estão concluídos e continuam sem prazo novo inventado.
3. Consulte [o índice das 8 SPECs](04_fase-atual/specs/00-INDICE.md) e a SPEC da task antes de alterar o app.
4. O Maestro executa uma task técnica por vez, roda as provas da SPEC e registra as evidências em '05_entregas/fase-1/SPEC-1-00N/'. Marca a task como concluída somente após a prova e o teste humano aplicável.
5. Após concluir, o Maestro seleciona a próxima task executável pelas dependências e continua, sem pedir nova escolha ou liberação do consultor para cada card. Pendências de informações e decisões são tratadas com Leonardo no card correspondente; a implementação prevista nas SPECs continua com fixtures e Apollo simulada no ambiente de teste. As condições para dados reais e os aceites humanos permanecem obrigatórios.

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

## Condições para os usos reais correspondentes

- Acesso ao Skip e ao Maestro e e-mails dos usuários.
- Primeiro perfil, critérios e exemplos: recebidos; distribuidores aprovados em 22/10.
- Apollo real: contratação/ativação adiada por decisão do Leonardo. Não cobrar chave agora; desenvolver e provar em modo simulado.
- Fontes de empresas e direito de uso aprovados; SIPEAGRO + Apollo são a proposta a confirmar.
- Regras de acesso, retenção e não contato aprovadas; cópia restaurada em teste antes de contatos reais.
- Capacidade: confirmada em 1/dia e 5/semana. Baseline e definição de contato válido continuam como verificações separadas; pedir apenas o que ainda faltar, no momento necessário.

Essas condições não bloqueiam a construção independente com fixtures prevista nas SPECs. O Maestro prepara os detalhes técnicos e apresenta uma decisão de negócio por vez.

Os prazos originais de 06/10 a 20/10/2026 foram preservados. A publicação do pacote não comprova execução, contratação de integrações ou aprovação de dados reais. Tasks e SPECs desta fase são sincronizadas pelo repositório operacional.
