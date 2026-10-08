# SPEC-1-008 — Primeira experiência visual do Radar Primitivo

**Fase:** 1
**Status:** planejada
**Dono:** Primitivo, com o Maestro; validação visual pelo Country Manager
**Origem no escopo:** DC-009 (interface enxuta), DC-012 (Skip + Maestro), RQ-009, CL-005; pedido do consultor de 08/10/2026 para uma entrega visual no início da fase usando as skills de UI/UX do cliente
**Degrau da solução:** reuso do app existente e recursos nativos do Skip — reutilizar componentes, autenticação e stack já presentes, aplicando as skills de UI/UX instaladas no ambiente do Maestro.

## Contexto e decisões fechadas

- **Estado atual:** a criação do app, login e papéis foi informada como já realizada pelo consultor. As telas funcionais estão especificadas nas SPECs 1-002, 1-004, 1-005, 1-006 e 1-007. O consultor quer enxergar o produto no começo da fase, enquanto critérios, acessos e integrações são preparados.
- **Estado desejado:** uma versão navegável e responsiva de Meu dia, Ficha da empresa e Perfis de busca, com dados fictícios e ações demonstráveis, dentro do app existente no projeto Skip de teste. O cliente valida a experiência antes da conexão das telas com dados reais.
- **Decisões fechadas:** esta entrega vem primeiro na lista; não depende de ICP real nem de Apollo; não recria app/login; não altera regras de acesso, coleções ou integrações; a implementação funcional continua nas SPECs originais e reutiliza os componentes visuais desta entrega.
- **Skills:** o Maestro deve listar as skills disponíveis no próprio ambiente, ler os SKILL.md das skills aplicáveis a design de interfaces/UI/UX e aplicar suas instruções. Nomes e disponibilidade ainda não foram comprovados neste pacote; não presumir um nome como `frontend-design` ou `ui-ux-pro-max`, nem instalar skill para satisfazer o requisito sem autorização específica.
- **Bloqueios:** acesso ao projeto de teste e app existente. Se nenhuma skill de UI/UX compatível estiver instalada/acessível, registrar a ausência e devolver ao consultor antes da implementação desta task; não alegar uso de skill nem trocar de plataforma silenciosamente.

## Resultado observável

O Country Manager abre o app de teste, identifica o que revisar hoje, abre uma empresa e entende sua nota, origem, decisor e próximo passo. Ele navega até os dois perfis de busca e volta à fila. Aprovar, adiar, descartar e desfazer mudam somente o estado demonstrativo; a versão para celular permite percorrer a mesma jornada. O modo demonstração fica explícito.

## Limites e dependências

- **Inclui:** três telas navegáveis, shell de navegação, componentes reutilizáveis de fila/ficha/formulário, direção visual, estados carregando/vazio/erro, ações simuladas e roteiro de validação visual.
- **Fora de escopo:** coleta de empresas, cálculo real do score, chamadas Apollo, enriquecimento, persistência comercial, ativação real de perfil, radar de notícias, pipeline comercial e modificação de autenticação/permissões. Esta versão não substitui o aceite funcional da Fase 1.
- **Entradas e pré-condições:** app existente com login; acesso ao projeto `radar-primitivo-teste`; skills de UI/UX já instaladas; identidade visual disponível no próprio app, quando existir. Se não houver identidade, usar a direção visual definida abaixo sem bloquear a demo.
- **Saídas:** telas no projeto de teste; componentes no código do app já existente; módulo e testes da simulação em `07-sistemas/radar-primitivo/`; evidências em `05_entregas/fase-1/SPEC-1-008/`.
- **Atores:** operador e administrador já cadastrados, com suas permissões atuais. A demonstração exige o mesmo login e acesso autorizado; não criar rota pública de demonstração.
- **Superfícies afetadas:** frontend do app existente; módulo de estado demonstrativo em `07-sistemas/radar-primitivo/ui/visual-demo-state.mjs`; testes em `07-sistemas/radar-primitivo/testes/visual-demo.test.mjs`. Respeitar a estrutura real do frontend encontrada no projeto, sem criar outra stack.
- **Dependências:** SPEC-1-001 para acesso já existente. SPEC-1-002 e SPEC-1-007 são contratos das telas finais, não pré-condições de APIs reais para esta demonstração.
- **Risco/plano B:** se a alteração conflitar com telas existentes, conservar as rotas atuais e implementar uma entrada “Demonstração” no ambiente de teste. Nunca sobrescrever dados ou abrir acesso para obter uma captura.
- **Rollback:** commit separado da UI; remover a entrada de demonstração e reverter os componentes deste recorte, preservando login e telas anteriores. Dados simulados ficam em memória e são restaurados ao recarregar.

## Direção visual e conteúdo

- Aproveitar marca, cores e componentes existentes. Na ausência de identidade, usar fundo claro, verde escuro como cor principal, texto com bom contraste e acentos discretos; tipografia e ícones já disponíveis no projeto.
- Desktop: navegação lateral com Meu dia e Perfis de busca; cabeçalho com perfil demonstrativo ativo, data e indicação “Demonstração — dados fictícios”. No celular, a navegação deve permanecer acessível sem cobrir o conteúdo.
- Meu dia: resumo de empresas para revisar, capacidade diária e créditos simulados; fila com nome, região, segmento, nota/faixa, motivo da prioridade e ação “Ver empresa”. Ações aprovar, adiar e descartar têm rótulos explícitos; adiar pede uma data e descartar um motivo.
- Ficha: título e contexto da empresa, bloco “Por que esta nota”, origem/data, decisor/cargo, contato claramente fictício e custo simulado. Toda origem local usa o rótulo “Exemplo demonstrativo”; não exibir URL de fonte real como comprovação de uma empresa fictícia.
- Perfis: distribuidores regionais e indústrias de fertilizantes/bioestimulantes como cartões separados; resumo de regiões, culturas, porte e cargos; formulário por seções. “Pré-visualizar perfil” altera somente a demonstração e não ativa perfil operacional.
- Preferir hierarquia clara, espaços consistentes e ações óbvias. Componentes de estado precisam mostrar o motivo e uma ação de recuperação; cor nunca é o único indicador.
- Não adicionar radar de mercado ou pipeline para preencher espaço visual; pertencem às fases posteriores.

## Dados e integrações

| Origem/destino | Fonte de verdade | Contrato | Acesso | Persistência/chamadas | Falha |
|---|---|---|---|---|---|
| Fixtures da demo | módulo local do frontend | seis empresas fictícias, dois perfis, três decisores fictícios, notas/faixas e créditos simulados | login existente no projeto de teste | memória; zero requisições comerciais externas | reset restaura estado inicial |
| Estado das ações | reducer `visual-demo-state.mjs`, usado pelo frontend | item + ação + data/motivo; estado anterior para desfazer | mesmo usuário autorizado | sem escrita em coleções reais ou localStorage | validar entrada e manter o estado anterior |
| Evidence da skill | `05_entregas/fase-1/SPEC-1-008/skills-ui-ux.md` | nome exato, localização/identificador, versão se disponível, decisões aplicadas | repositório operacional | registrar metadados, sem copiar SKILL.md de terceiros | ausência da skill bloqueia a task e é informada |

**Fixtures mínimas:** seis empresas identificadas como demonstração: Agro Horizonte Demo, Solo Vivo Demo, Campo Sul Demo, Nutri Terra Demo, Bio Cultivo Demo e Raiz Norte Demo; perfis `demo-distribuidores` e `demo-industrias`. Usar contatos apenas como `pessoa1@example.com`, sem telefone real. Cinco itens inicialmente na fila e um fora dela; capacidade simulada 5. Incluir nota alta, média e desconhecida; três itens com decisor e dois sem contato. Notas e custos são valores ilustrativos fixos, sem alegar cálculo real.

**Contrato do estado demonstrativo:** o módulo exporta `createInitialDemoState()` e `reduceDemoState(state, action)`; o frontend usa essas mesmas funções. Ações nomeadas: `APPROVE`, `POSTPONE` (id + data ISO), `DISCARD` (id + motivo), `UNDO` (última decisão) e `RESET`. Cada transição retorna novo estado com fila, decisões, erro de campo e última decisão reversível, sem mutar o estado de entrada. O relógio da demo é fixo em `2026-10-08`, America/Sao_Paulo, mostrado como “Data de referência da demonstração”. Isso permite testar adiamento sem depender da data real de execução.

## Fluxo e regras

1. Conferir o app e as skills instaladas; ler as skills aplicáveis, registrar o que será reutilizado e proteger as rotas existentes.
2. Montar Meu dia e a Ficha com fixtures e componentes da stack atual. Implementar o estado demonstrativo em módulo utilizado pelo frontend e coberto pelos testes.
3. Conectar a navegação entre Meu dia, Ficha e Perfis sem backend novo. Voltar preserva o estado da sessão de demonstração; recarregar restaura as fixtures.
4. Aprovar/descartar retiram o item da fila e atualizam o contador; descartar exige motivo com ao menos um caractere não branco. Adiar exige data ISO válida posterior a `2026-10-08`: ao confirmar, retira o item da fila do dia, atualiza o contador e mostra a confirmação “Adiado para dd/mm/aaaa”. Toda decisão oferece desfazer, que restaura item, posição e contagem anteriores; na demo basta desfazer a última decisão. Data ausente, inválida ou igual/anterior ao dia de referência e motivo vazio exibem erro junto ao campo, mantendo item e contagem. A demo não agenda reentrada real.
5. Mostrar carregando, vazio e erro por controles disponíveis somente no ambiente de teste; o cenário vazio oferece restaurar demonstração, e o erro permite tentar novamente sem perder login.
6. Capturar desktop/celular, exercitar teclado e apresentar ao Country Manager. Ajustes aprovados de hierarquia, navegação e linguagem são levados às telas finais por suas SPECs originais.

| Cenário | Ação | Esperado |
|---|---|---|
| Principal | Meu dia → empresa → voltar → Perfis | mesma jornada navegável, item e perfil coerentes |
| Principal | aprovar um item e desfazer | fila/contagem mudam e retornam ao estado anterior |
| Principal | adiar para 09/10/2026 e desfazer | item sai da fila, contador diminui, data aparece na confirmação; desfazer restaura posição/contador |
| Principal | descartar com motivo e desfazer | item sai da fila, contador diminui; desfazer restaura posição/contador |
| Limite | adiar sem data / descartar sem motivo | erro visível, sem mudança da fila |
| Limite | adiar para 08/10/2026 ou data inválida | erro de data, item e contador preservados |
| Limite | viewport 375×812 | conteúdo e ações utilizáveis, sem rolagem horizontal da página |
| Falha | alternar para vazio/erro e recuperar | explicação e ação funcionam sem atingir dados reais |
| Acesso | abrir demo sem login | mantém o bloqueio da autenticação existente |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, as SPECs 1-002 e 1-007 nesta pasta, o frontend existente e os SKILL.md das skills de UI/UX listadas pelo Maestro no ambiente do cliente. O agente aplica essas skills durante a construção, não apenas as menciona.
2. **Alterar somente:** frontend/rotas de demonstração no projeto Skip de teste, componentes reutilizados, módulo de simulação, seus testes e evidências.
3. **Não alterar:** login/papéis, coleções, credenciais, integrações, produção ou regras de score; não instalar skills, não substituir a stack e não efetuar chamadas Apollo.
4. **Executar na ordem:** descoberta/leitura das skills → RED dos testes de simulação e roteiro visual inicial → UI e navegação demonstrativa → GREEN → revisão responsiva/acessibilidade → validação visual do cliente.
5. **Parar e informar:** se não houver skill compatível, faltar acesso ao app de teste, a mudança exigir abrir permissão ou alterar produção, ou houver pedido de capacidade fora das três telas. Registrar o impedimento sem declarar conclusão.
6. **Estado válido ao parar:** login existente intacto; app original utilizável; demo isolada, fictícia e restaurável. A prova visual não comprova integração nem substitui o teste ponta a ponta da SPEC-1-007.

## Checklist de execução

- [ ] skills de UI/UX instaladas identificadas, lidas e decisões aplicadas registradas
- [ ] três telas navegáveis com fixtures e modo demonstrativo explícito
- [ ] aprovar/adiar/descartar/desfazer e validação de campos funcionando somente em memória
- [ ] carregando/vazio/erro e recuperação demonstrados
- [ ] desktop e celular utilizáveis, foco visível, teclado e rótulos conferidos
- [ ] login e permissões existentes preservados; nenhuma escrita em dados reais ou consumo Apollo
- [ ] capturas, gravação, saídas dos testes e feedback do Country Manager registrados

## Critérios de aceite

- [ ] **CA-1-35:** registro identifica as skills de UI/UX realmente instaladas e lidas e ao menos três decisões de interface aplicadas com base nelas; a UI usa componentes existentes e evidencia modo demonstração.
- [ ] **CA-1-36:** as três telas são navegáveis; aprovar/adiar/descartar/desfazer se comportam como o fluxo acima; entradas inválidas não alteram o estado; recarregar restaura as seis fixtures e cinco itens da fila, sem chamadas comerciais ou gravação real.
- [ ] **CA-1-37:** em 1440×900 e 375×812 a página não tem rolagem horizontal nem ações cortadas; navegação por teclado alcança os controles com foco visível; campos têm rótulos; cores não são o único indicador; vazio/erro/carregando têm comportamento observável e recuperação.
- [ ] **CA-1-38:** o Country Manager executa o roteiro de CL-005 e registra aprovado ou ajustes; a task de validação só fecha com aprovação explícita após os ajustes, com evidência.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Esperado | Evidência |
|---|---|---|---|---|
| RED | testes das funções consumidas pela UI: aprovar/desfazer; adiar para 09/10/2026/desfazer; descartar com motivo/desfazer; adiar sem data, inválida ou até 08/10; descartar sem motivo; reset e não mutação | criar `visual-demo.test.mjs` e rodar `node --test 07-sistemas/radar-primitivo/testes/visual-demo.test.mjs` antes de implementar o módulo | falha por comportamento/módulo ausente — CA-1-36 | `red.txt` |
| RED | roteiro visual antes da entrega | tentar percorrer Meu dia → Ficha → Perfis e registrar lacunas; conferir ausência do registro de skills | elementos/fluxos ainda ausentes — CA-1-35 a CA-1-37 | `antes.md` e captura permitida |
| GREEN | módulo utilizado pelo frontend + navegação visual | repetir `node --test 07-sistemas/radar-primitivo/testes/visual-demo.test.mjs`; percorrer as três telas; aprovar/desfazer, adiar para 09/10/2026/desfazer e descartar com motivo/desfazer, gravando item/posição/contador antes e depois; reset restaura seis empresas e cinco itens; conferir painel de rede | testes passam e UI reflete as transições definidas; apenas recursos/autenticação existentes, zero chamadas de negócio — CA-1-36 | `green.txt`, `navegacao.webm`, `rede.md` sem credenciais |
| GREEN | aplicação da skill e interface | conferir registro de skills e três decisões contra a UI, screenshots desktop/celular | CA-1-35 e parte visual de CA-1-37 passam | `skills-ui-ux.md`, `desktop.png`, `mobile.png` |
| REFACTOR/REGRESSÃO | responsividade, teclado, erro e recuperação, acesso | 1440×900 e 375×812; Tab/Shift+Tab/Enter/Escape nos controles; alternar loading/vazio/erro; recarregar; abrir sem login; repetir testes | CA-1-36/37 passam, sem regressão no login e sem escritas reais | `revisao-ui.md`, capturas e `green.txt` |
| ACEITE HUMANO | CL-005 | executar roteiro abaixo e registrar feedback; repetir após ajustes | CA-1-38 só passa após aprovação explícita | `aceite-visual.md` |

O primeiro card cria o módulo de simulação e seus testes na stack já existente. O segundo executa o roteiro de browser com as ferramentas disponíveis no ambiente, incluindo os viewports indicados; não depende da instalação de biblioteca de automação. Sem controle de viewport, registrar impedimento do CA-1-37, nunca inferir que passou. Capturas e testes são entregas futuras desta SPEC, não provas já executadas pela redação do documento.

## Teste humano do cliente

- **Origem:** CL-005 — avaliar o protótipo do app.
- **Quem testa:** Leonardo, Country Manager.
- **Passos:** abrir Meu dia; apontar onde ver prioridade e motivo; abrir uma empresa e localizar origem, nota e decisor; aprovar e desfazer; tentar adiar sem data e depois com data; acessar os dois perfis e voltar; repetir a navegação no celular; dizer o que falta, sobra ou mudaria.
- **Resultado esperado:** entender a próxima ação e percorrer a jornada nas três telas; identificar o caráter fictício dos dados; registrar aprovação ou ajustes objetivos.
- **Evidência:** gravação/capturas permitidas e resposta em `05_entregas/fase-1/SPEC-1-008/aceite-visual.md`. Ajustes pendentes mantêm o card aberto.

## Handoff e operação

- **Demonstrar:** partir de Meu dia e terminar em Perfis em uma sessão curta, incluindo uma decisão reversível.
- **Operar:** demo no ambiente de teste; fixtures restauráveis por reset/reload; preservar a implementação visual para as integrações das SPECs originais.
- **Monitorar:** console sem erros da demo; manter testes do módulo e roteiro visual após alterações.
- **Pendência:** nomes das skills serão registrados durante a execução no ambiente real do Maestro; acesso e disponibilidade não foram confirmados por esta redação.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| id pendente | Criar a primeira versão visual do Radar Primitivo | Primitivo | SPEC-1-008 | CA-1-35, CA-1-36 | skills aplicadas, RED/GREEN do estado, três telas e navegação em demo | skills-ui-ux.md, red.txt, green.txt, navegacao.webm | app/teste acessível e skills instaladas |
| id pendente | Testar a navegação e o visual no celular | Primitivo | SPEC-1-008 | CA-1-36, CA-1-37 | regressão de teclado, viewports, vazio/erro e reset | desktop.png, mobile.png, revisao-ui.md | primeira versão visual pronta |
| id pendente | Validar o visual do app com o Country Manager | Primitivo | SPEC-1-008 | CA-1-38 | roteiro CL-005 e ajustes até aceite explícito | aceite-visual.md | revisão de navegação/visual aprovada |

## Emendas

| Data | Origem do sinal | Ajuste | Motivo |
|---|---|---|---|
| 08/10/2026 | pedido do consultor | nova SPEC e três cards antes das tasks de preparação | tornar a entrega visual explícita e antecipada, com aplicação das skills de UI/UX existentes |
