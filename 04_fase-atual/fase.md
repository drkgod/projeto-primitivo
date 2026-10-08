# Fase 1 — Tarefas

<!-- fase-format:2 -->

Cada linha é uma tarefa da Jornada de Execução. **Tudo que cabe num card cabe nesta linha** — se um
campo não estiver aqui, ele não tem como ser preenchido, porque é este arquivo que cria a tarefa.

```
- [ ] Título da tarefa @responsável !30/09/2026 #projeto [interno]   <!-- id:… -->
      > descrição da tarefa, uma ou mais linhas
  - [ ] subtarefa (basta indentar 2 espaços)                         <!-- id:… -->
    - [ ] sub-subtarefa (indente mais 2)                             <!-- id:… -->
```

| marcador | o que define | se você não escrever |
|---|---|---|
| `- [ ]` / `- [/]` / `- [x]` | a fazer / em andamento / concluída | a fazer |
| `@nome` | responsável (`@"Nome Composto"` com aspas) | fica **sem responsável** |
| `!dd/mm/aaaa` | prazo | fica **sem prazo** |
| `#projeto` / `#aculturamento` | tipo | Projeto de IA |
| `[interno]` | o cliente **não** vê esta tarefa | o cliente vê |
| `> texto` na linha de baixo | descrição (aparece ao abrir o card) | sem descrição |
| indentar 2 espaços | vira subtarefa da tarefa acima (vale em qualquer profundidade) | tarefa de topo |

Os marcadores só valem **no fim da linha** — `Revisar #3 do contrato` continua sendo um título.
Um título que TERMINA na forma de um marcador sai escapado com `\\` (`Ligar para \\@joao`); a barra é
só para o parser e nunca aparece no card. Você não precisa escrever isso à mão.
Marque `[x]` para concluir e adicione linhas novas à vontade: elas entram no quadro na próxima
sincronização e voltam aqui com o `<!-- id:… -->` preenchido. **Não apague o marcador de id** das
tarefas que já têm um.

- [ ] Criar a primeira versão visual do Radar Primitivo @Primitivo
  > Começar por uma versão navegável de Meu dia, Ficha da empresa e Perfis de busca no app existente, com dados fictícios e ações simuladas. Reaproveitar login e componentes já prontos; não depende de ICP real nem de Apollo.
  > O Maestro deve localizar, ler e aplicar as skills de UI/UX já instaladas no ambiente e registrar quais usou e as decisões de design. Se nenhuma estiver disponível, informar o impedimento antes de implementar. SPEC-1-008 · CA-1-35, CA-1-36. Prova: registro das skills, testes RED/GREEN do estado da demo e gravação das três telas navegáveis.
- [ ] Testar a navegação e o visual no celular @Primitivo
  > Após a primeira versão visual, testar desktop 1440×900 e celular 375×812, teclado, foco, rótulos, estados vazio/erro/carregando e recuperação. Conferir ações simuladas e reset; corrigir problemas sem alterar backend, permissões ou produção.
  > SPEC-1-008 · CA-1-36, CA-1-37. Prova: capturas desktop/mobile, roteiro de regressão visual e testes verdes. A task para ao final da revisão, antes do aceite humano.
- [ ] Validar o visual do app com o Country Manager @Primitivo
  > Apresentar a versão revisada ao Leonardo: abrir fila, entender a prioridade, abrir ficha, aprovar/desfazer, adiar e navegar entre perfis; repetir no celular e registrar o que falta, sobra ou mudaria. Fazer os ajustes visuais solicitados e obter aprovação explícita.
  > SPEC-1-008 · CA-1-38 · CL-005. Prova: roteiro e aceite-visual.md. A aprovação visual não encerra a Fase 1 nem comprova integrações; a jornada real permanece na SPEC-1-007.
- [ ] Escolher o primeiro perfil e enviar os critérios de bom cliente @Primitivo !07/10/2026  <!-- id:dcc49939-f29e-46ac-8eba-832b3bf5c9e0 -->
  > Com esses critérios o app dá a nota de cada empresa e decide quem entra na fila. Enviar pelo grupo do WhatsApp, em texto ou documento.
  > SPEC-1-002 · pré-condição do CA-1-08. Checklist: CL-001.
  - [ ] Escolher entre distribuidores e indústrias para começar @Primitivo !07/10/2026  <!-- id:a12bc875-7c44-4794-bda8-1e03256ab499 -->
    > Distribuidores regionais (importação direta/marca própria) ou indústrias de fertilizantes e bioestimulantes (matéria-prima). O outro perfil fica pronto, em rascunho. SPEC-1-002.
  - [ ] Enviar cinco bons e cinco maus exemplos de empresas @Primitivo !07/10/2026  <!-- id:5e6af5ed-0e53-4432-b6f1-131a828b3316 -->
    > Nome e estado de cada empresa; servem para conferir se a nota do app separa os bons dos maus. SPEC-1-002 (amostra usada na SPEC-1-005).
  - [ ] Listar regiões, culturas, porte e cargos que importam @Primitivo !07/10/2026  <!-- id:b4cda5f4-8a97-4ebe-82a4-a909ffe5c2d0 -->
    > Estados/municípios, culturas (soja, milho, café…), porte mínimo e até três famílias de cargo com os títulos usados no setor. SPEC-1-002.
  - [ ] Listar empresas que nunca devem entrar na fila @Primitivo !07/10/2026  <!-- id:4db121ca-a846-4921-aa11-d5000f9ee28c -->
    > Clientes atuais, concorrentes, parceiros ou empresas que já recusaram. SPEC-1-002.
- [ ] Liberar o acesso à Apollo com limite mensal de créditos @Primitivo !08/10/2026  <!-- id:c5e72ce3-d293-46c7-a104-67e8f2a0993d -->
  > A Apollo é a fonte oficial de decisores e contatos. Sem plano com API, chave e teto, o app funciona só em modo de simulação.
  > SPEC-1-003 · pré-condição dos CA-1-11 e CA-1-13. Checklist: CL-PEND-002.
  - [ ] Confirmar o plano da Apollo com acesso à API @Primitivo !07/10/2026  <!-- id:f97fc9b8-69e4-49c7-a3c8-cb6e648b56a5 -->
    > Confirmar o plano contratado, o acesso à API e quantos créditos cada tipo de busca consome. SPEC-1-003.
  - [ ] Definir o teto mensal de créditos e o custo por contato @Primitivo !08/10/2026  <!-- id:8bf96caf-e6b7-4e95-b440-113fd5544461 -->
    > Valor máximo de créditos por mês e custo máximo aceitável por contato válido. Ao atingir o teto, o app para de consumir. SPEC-1-003 · CA-1-11.
  - [ ] Cadastrar a chave da Apollo no cofre do Skip @Primitivo !08/10/2026  <!-- id:c025b258-9ed3-42d4-a9a8-7cd6999f5786 -->
    > A chave fica só no cofre de segredos do projeto de produção; nunca em tela, arquivo ou mensagem. SPEC-1-003 · CA-1-09.
- [ ] Aprovar a fonte inicial de empresas @Primitivo !08/10/2026  <!-- id:8f422530-9b50-4607-be7f-8c9b35f27e0a -->
  > Proposta: base oficial SIPEAGRO (estabelecimentos de fertilizantes registrados no MAPA, dados abertos) e busca de empresas na Apollo pelo perfil. Aprovar as duas rotas, o endereço exato do arquivo oficial e a rotina diária.
  > SPEC-1-004 · pré-condição do CA-1-14. Checklist: CL-PEND-003.
- [ ] Aprovar as regras de uso dos contatos @Primitivo !08/10/2026  <!-- id:3de24d80-34be-4b4e-8184-4657bec6f4b5 -->
  > Regras mínimas antes de qualquer contato real entrar no app: quem acessa, por quanto tempo o contato fica guardado e como atender um pedido de não contato.
  > SPEC-1-001 · pré-condição do CA-1-03. Checklist: CL-PEND-004.
  - [ ] Definir quem pode ver e editar contatos no app @Primitivo !07/10/2026  <!-- id:f29d5193-aec5-42ec-9ac9-9b528cec32ba -->
    > Confirmar os papéis: operador (Country Manager) e administrador. SPEC-1-001.
  - [ ] Definir o prazo de guarda dos contatos @Primitivo !08/10/2026  <!-- id:501bd0d0-578c-4dd9-9a37-5f993145e0c0 -->
    > Quantos dias um contato fica guardado antes de ser apagado. SPEC-1-001 · CA-1-03.
  - [ ] Definir como tratar pedido de não contato @Primitivo !08/10/2026  <!-- id:73becc1c-83b1-447f-a30e-8e1bfd4f7f1a -->
    > Quem registra o pedido e confirmação de que o contato bloqueado nunca volta por nenhuma carga. SPEC-1-001 · CA-1-03.
- [ ] Montar a tela de perfis de busca @Primitivo !08/10/2026  <!-- id:d746b918-362a-4fbb-8763-0f0e4b634eb1 -->
  > Tela com os dois perfis, formulário por seções e resumo do que falta antes de ativar.
  > SPEC-1-002 · CA-1-05, CA-1-06. Prova: testes de perfis verdes.
  - [ ] Criar os perfis de distribuidores e de indústrias @Primitivo !08/10/2026  <!-- id:9e081d10-e673-42ae-a730-e73e175cd576 -->
    > Dois perfis independentes, cada um com critérios, cargos, capacidade e teto próprios. SPEC-1-002 · CA-1-07.
  - [ ] Impedir a ativação de perfil incompleto @Primitivo !08/10/2026  <!-- id:ccc168e0-3178-4bb0-b2e6-a1bb34ea4b12 -->
    > Perfil sem região, cargo, critério, capacidade ou teto continua em rascunho e mostra a lista do que falta. SPEC-1-002 · CA-1-06.
- [ ] Medir o tempo atual de pesquisa e informar a capacidade diária @Primitivo !09/10/2026  <!-- id:417da661-3d97-4501-8612-884e5a5c0ff5 -->
  > Anotar quanto tempo leva hoje para achar empresa, decisor e contato (cinco pesquisas), quantos leads novos dá para trabalhar por dia e por semana, e o que conta como contato válido e por quantos dias.
  > SPEC-1-007 · pré-condição do CA-1-32. Checklist: CL-PEND-005.
- [ ] Ativar o primeiro perfil com os critérios do cliente @Primitivo !09/10/2026  <!-- id:bba1553f-6269-48b4-886c-5f3cc81cf4f1 -->
  > Preencher o perfil escolhido com o que o Leonardo enviou, ativar e pedir que ele confira o resumo.
  > SPEC-1-002 · CA-1-05, CA-1-08. Prova: perfil ativo com versão e mensagem de confirmação do Country Manager.
- [ ] Conectar o app à Apollo com controle de créditos @Primitivo !09/10/2026  <!-- id:c342f4e5-ab24-4894-a4ee-0fedd9380088 -->
  > Uma única porta de saída para a Apollo: respeita o teto, não repete consumo, registra cada chamada e tem modo de simulação para testes.
  > SPEC-1-003 · CA-1-09, CA-1-10. Prova: testes da Apollo verdes em modo simulado.
  - [ ] Registrar cada consumo de créditos da Apollo @Primitivo !09/10/2026  <!-- id:3fb35c66-3910-47a9-9467-2264c7a1293f -->
    > Toda chamada fica registrada com perfil, tipo, créditos e resultado; a mesma chamada não é feita duas vezes. SPEC-1-003 · CA-1-10.
  - [ ] Bloquear chamadas acima do teto @Primitivo !09/10/2026  <!-- id:af955f24-6373-47bf-9ee5-6faaa72cf1f5 -->
    > Chamada que passaria do teto não acontece e aparece como alerta na Administração. SPEC-1-003 · CA-1-11.
  - [ ] Medir a cobertura da Apollo com os bons exemplos @Primitivo !09/10/2026  <!-- id:cbfebd9a-e04c-4066-b13f-7cce062c8558 -->
    > Buscar na Apollo as cinco empresas boas enviadas pelo cliente e registrar quantas foram encontradas. SPEC-1-003 · CA-1-13.
- [ ] Buscar empresas automaticamente a partir do perfil @Primitivo !13/10/2026  <!-- id:7ada1a8b-83db-451a-b582-3fb3ab2c6e27 -->
  > Em dias úteis, às 05:00, o app busca sozinho empresas do perfil ativo, sem ninguém subir lista, e guarda a origem e a data de cada dado.
  > SPEC-1-004 · CA-1-14. Prova: testes de descoberta verdes e relatório da primeira execução real.
  - [ ] Importar empresas da base oficial do MAPA @Primitivo !09/10/2026  <!-- id:80743b26-bb73-4698-ab61-0dab851f42e6 -->
    > Ler o arquivo oficial aprovado, filtrar pelo perfil e gravar as empresas com origem e data. O CNPJ mascarado fica como veio. SPEC-1-004 · CA-1-14, CA-1-16.
  - [ ] Buscar empresas na Apollo pelo perfil ativo @Primitivo !13/10/2026  <!-- id:4f4c732f-f8ea-4340-8570-b14e0ef57a5e -->
    > Segunda rota automática, pela conexão com teto: estados, termos de segmento e porte do perfil. SPEC-1-004 · CA-1-14.
  - [ ] Agendar a busca diária antes da fila @Primitivo !13/10/2026  <!-- id:6e125b5e-1e2c-4844-85bc-9fd30e9b9a88 -->
    > Rotina em dias úteis às 05:00 (horário de Brasília), em lotes, retomando de onde parou. SPEC-1-004 · CA-1-14.
- [ ] Juntar empresas repetidas sem perder a origem @Primitivo !13/10/2026  <!-- id:1bb3ec25-92ce-4b5d-9fa4-9fe5b7791700 -->
  > A mesma empresa vinda das duas rotas vira uma ficha só, com as duas origens. Casos parecidos mas não iguais vão para revisão do Country Manager.
  > SPEC-1-004 · CA-1-15. Prova: testes de consolidação e captura da ficha com duas origens.
- [ ] Ativar a lista de bloqueio de contatos @Primitivo !13/10/2026  <!-- id:da111830-3e39-4b1b-aa96-09f995a21d0e -->
  > E-mail, telefone ou pessoa bloqueada nunca é gravada nem consulta créditos; o prazo de guarda aprovado fica registrado.
  > SPEC-1-001 · CA-1-03. Prova: testes de bloqueio verdes.
- [ ] Calcular a nota de cada empresa com explicação @Primitivo !14/10/2026  <!-- id:39e37980-a89b-4e2f-8d7e-82d2da3decb1 -->
  > Toda empresa recebe nota, faixa A/B/C/D e a explicação de cada critério, com fonte e data. Dado desconhecido não soma ponto.
  > SPEC-1-005 · CA-1-19, CA-1-20. Prova: testes de nota verdes.
  - [ ] Aplicar os critérios e pesos aprovados @Primitivo !14/10/2026  <!-- id:54fa2b52-0947-4f36-a29e-395f3b5e723d -->
    > A nota usa somente os critérios e pesos do perfil ativo; impeditivo confirmado bloqueia a empresa. SPEC-1-005 · CA-1-19, CA-1-20.
  - [ ] Mostrar por que a empresa ganhou ou perdeu pontos @Primitivo !14/10/2026  <!-- id:9177ae39-b81b-4c80-87e0-aaf203f405d8 -->
    > Bloco “Por que esta nota” na ficha, legível sem ajuda técnica. SPEC-1-005 · CA-1-19.
  - [ ] Voltar a nota para a versão anterior @Primitivo !14/10/2026  <!-- id:d0eb365c-491c-4cd2-bd00-93a5540a0583 -->
    > Reativar a versão anterior do perfil recalcula as notas e mantém o histórico. SPEC-1-005 · CA-1-22.
- [ ] Liberar para contatos só as empresas aprovadas na nota @Primitivo !14/10/2026  <!-- id:3711059c-c7f6-4bf3-bd18-48d92e962e0c -->
  > Só as faixas liberadas no perfil seguem para busca de decisores; as demais não gastam nenhum crédito.
  > SPEC-1-005 · CA-1-21. Prova: teste com zero chamada para empresas fora da faixa.
- [ ] Manter a busca funcionando quando a fonte falhar @Primitivo !14/10/2026  <!-- id:b1ac5f45-7f33-4c99-83c2-fe7e88a06b9b -->
  > Se a base oficial ou a Apollo saírem do ar, nada é apagado e a falha aparece; planilha e inclusão manual existem só como contingência, com motivo.
  > SPEC-1-004 · CA-1-17, CA-1-18.
  - [ ] Incluir empresas por planilha só como contingência @Primitivo !14/10/2026  <!-- id:db8cd666-263d-4716-acad-5c682ae0c3be -->
    > Planilha ou cadastro manual exigem motivo: contingência, correção ou carga histórica. SPEC-1-004 · CA-1-18.
  - [ ] Testar fonte fora do ar e lote repetido @Primitivo !14/10/2026  <!-- id:a6c9068a-0acb-4008-80a7-a0e1c14f0339 -->
    > Rodar a mesma busca duas vezes sem duplicar e simular a base oficial indisponível. SPEC-1-004 · CA-1-17.
- [ ] Conferir a nota com empresas conhecidas @Primitivo !15/10/2026  <!-- id:b1801004-71d4-4cc4-a1d0-f3cda7eee2a0 -->
  > O Leonardo confere no app a nota dos cinco bons e cinco maus exemplos e aprova a primeira versão dos critérios, ou pede ajuste.
  > SPEC-1-005 · CA-1-23. Checklist: CL-PEND-008.
- [ ] Buscar decisores e revelar contatos das empresas aprovadas @Primitivo !15/10/2026  <!-- id:d698d805-a136-48ae-b853-eae5fdbf4a66 -->
  > Para cada empresa aprovada, o app busca os decisores pelos cargos do perfil, escolhe por regra e revela o contato dentro do teto. Nesta data, em modo de simulação; dados reais só depois do teste de restauração.
  > SPEC-1-006 · CA-1-24, CA-1-25, CA-1-28.
  - [ ] Buscar decisores pelos cargos do perfil @Primitivo !15/10/2026  <!-- id:1350feb2-6a4e-492b-9ea3-773c02b0a52c -->
    > Busca automática na Apollo com os títulos e senioridades do perfil; sem resultado, fica registrado “não encontrado”. SPEC-1-006 · CA-1-24.
  - [ ] Revelar contatos só das pessoas escolhidas @Primitivo !15/10/2026  <!-- id:42786d0f-3989-4e10-9ea6-a17e00c66bf5 -->
    > Só a pessoa escolhida pela regra tem o contato revelado, com créditos, origem e data; contato bloqueado nunca é gravado. SPEC-1-006 · CA-1-25, CA-1-27.
  - [ ] Aplicar o prazo de guarda aos contatos @Primitivo !15/10/2026  <!-- id:25a87e59-9976-4166-be0b-5ae420f4632b -->
    > Rotina diária apaga o valor dos contatos que passaram do prazo aprovado. SPEC-1-006 · CA-1-27.
- [ ] Montar a fila do dia com aprovar, adiar e descartar @Primitivo !16/10/2026  <!-- id:51b5d269-9f90-41b3-b491-4d112665d855 -->
  > Às 07:00 de dias úteis, “Meu dia” traz a fila do tamanho da capacidade, com empresa, decisor, contato, nota e motivo. Cada decisão pede um clique e um motivo curto.
  > SPEC-1-007 · CA-1-29, CA-1-30. Prova: testes de fila e decisões verdes.
  - [ ] Limitar a fila à capacidade e explicar fila vazia @Primitivo !16/10/2026  <!-- id:6e7e9935-db05-4aad-b86a-cecfb7895f9c -->
    > A fila respeita a capacidade diária e semanal e o teto; quando vem vazia, diz o motivo. SPEC-1-007 · CA-1-29.
  - [ ] Mostrar origem, nota, contatos e custo na ficha @Primitivo !16/10/2026  <!-- id:78dcadd3-cc42-40e9-b795-3e1d7a3a86e2 -->
    > Ficha com dados e origens, explicação da nota, decisores e contatos com origem e créditos gastos. SPEC-1-007 · CA-1-31.
- [ ] Registrar contato manual quando a Apollo não encontrar @Primitivo !16/10/2026  <!-- id:4027f1a9-d205-42da-9389-ca9e8c846d38 -->
  > Botão na ficha para registrar decisor/contato manual com motivo; o contato da Apollo nunca é sobrescrito e a diferença fica visível.
  > SPEC-1-006 · CA-1-26.
- [ ] Testar a Apollo fora do ar e o teto atingido @Primitivo !16/10/2026  <!-- id:a9202438-5f6f-43ca-bb0e-58137ea6b3e6 -->
  > Simular Apollo indisponível, chave inválida e teto atingido com as rotinas de busca e de contatos: nada se perde e o consumo para.
  > SPEC-1-003 · CA-1-11, CA-1-12.
- [ ] Testar a cópia de segurança e a restauração dos dados @Primitivo !16/10/2026  <!-- id:9b89e7d8-fe97-4822-85bf-7fd73babe694 -->
  > Gerar a cópia dos dados de teste e restaurar no projeto de ensaio, conferindo contagens e bloqueios. Só depois disso contatos reais podem entrar no app.
  > SPEC-1-001 · CA-1-04.
  - [ ] Gerar a cópia de segurança dos dados do app @Primitivo !16/10/2026  <!-- id:97edf1d9-f3cd-434a-baf6-ac7f53e7e5ac -->
    > Cópia de todas as coleções com contagens e verificação de integridade. SPEC-1-001 · CA-1-04.
  - [ ] Restaurar a cópia em um projeto de teste e conferir @Primitivo !16/10/2026  <!-- id:7df5f753-2ce9-4b93-94bd-c378d10f0b4a -->
    > Contagens iguais e nenhum contato bloqueado de volta; então liberar contato real em produção. SPEC-1-001 · CA-1-04.
- [ ] Registrar tempo, volume, créditos e contatos válidos @Primitivo !19/10/2026  <!-- id:282e1d90-af2e-4474-961d-c38799c324f9 -->
  > Relatório semanal com empresas novas por rota, faixas, contatos válidos, créditos, custo por contato válido e tempo de revisão, ao lado do tempo medido antes.
  > SPEC-1-007 · CA-1-32.
- [ ] Testar a jornada completa com dados autorizados @Primitivo !19/10/2026  <!-- id:aa5cb47b-252d-4b9e-9390-6efb8ef5d818 -->
  > O Leonardo percorre a jornada real — perfil, empresas, nota, decisores, fila e decisões — sem planilha, grava a tela e registra o aceite ou o que não aceitou.
  > SPEC-1-007 · CA-1-33. Checklist: CL-PEND-006.
- [ ] Validar a Fase 1 em call com o consultor @"Rodrigo Santos" !20/10/2026  <!-- id:55b888f1-86e0-4bd7-8cfc-3f612dd55113 -->
  > Call de validação: demonstração da jornada e conferência dos critérios de aceite das sete SPECs da Fase 1.
  > SPEC-1-007 · CA-1-34.
- [ ] Revisar as evidências e decidir o fechamento da Fase 1 @"Rodrigo Santos" !20/10/2026  <!-- id:02b1b0f0-5bfa-4c3e-94bb-eb540d9dbf02 -->
  > O consultor revisa as evidências de cada SPEC e registra a decisão: Fase 1 aceita, aceita com pendência ou não aceita.
  > SPEC-1-007 · CA-1-34.
