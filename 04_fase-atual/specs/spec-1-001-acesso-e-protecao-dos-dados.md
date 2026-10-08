# SPEC-1-001 — Acesso protegido e proteção mínima dos dados

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (execução com o Maestro); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-009, DC-012; RQ-016 (mínimo), RQ-019 (mínimo recuperável); gate G-02; critério da Fase 1 “auditoria básica, retenção/supressão e restauração da cópia mínima passam antes de entrar contato real”  
**Degrau da solução:** nativo da plataforma — autenticação, regras de acesso por coleção, hooks e segredos do Skip (PocketBase); só a cópia lógica de segurança é construção mínima, porque o backup nativo não está comprovado para este projeto.

## Contexto e decisões fechadas

- **Estado atual:** não existe app; a operação usa planilhas e o Google Drive do Country Manager. A Fase 1 vai receber nomes, cargos e contatos de decisores (dado pessoal).
- **Estado desejado:** o app “Radar Primitivo” existe no Skip, só abre com login, separa o que o operador e o administrador podem fazer, registra as ações críticas, mantém uma lista de bloqueio que impede reintroduzir contatos, guarda o prazo de guarda aprovado e tem uma cópia de segurança restaurada em teste.
- **Decisões já fechadas:**
  - plataforma: três projetos Skip com as mesmas migrações e hooks — `radar-primitivo` (produção, único com dados reais e chave real da Apollo), `radar-primitivo-teste` (testes automáticos, só dados fictícios, Apollo sempre em modo simulado) e `radar-primitivo-restauro` (somente ensaio de restauração);
  - autenticação: coleção de autenticação `users` do Skip, login por e-mail e senha, sem cadastro aberto;
  - papéis: `operador` (Country Manager: perfis, fila, ficha, decisões) e `admin` (tudo do operador + usuários, supressões, cópias, consumo e configurações). Uma pessoa pode ter o papel `admin`;
  - segredos (chaves de API e sal de supressão) só em segredos do Skip (`$secrets`), nunca no código, no front ou em log;
  - nenhuma automação envia mensagem, e-mail ou ligação.
- **Bloqueios:** valores de prazo de guarda, quem acessa contatos e tratamento de pedido de não contato dependem da task “Aprovar as regras de uso dos contatos”. Sem ela, o app pode ser construído e testado com dados fictícios, mas nenhum contato real entra.

## Resultado observável

O Country Manager entra no app com o próprio login e vê somente o que o papel permite; quem não está logado não acessa nenhum dado; toda ação crítica aparece no histórico; um contato bloqueado não volta por nenhuma carga; e uma cópia dos dados é restaurada em um projeto de teste com contagens e bloqueios conferidos. A partir daí o app pode receber contatos reais.

## Limites e dependências

- **Inclui:** projeto Skip, login, papéis, regras de acesso das coleções criadas nesta SPEC, coleção de auditoria, lista de supressão com verificação reutilizável, registro do prazo de guarda aprovado, cópia lógica de segurança e restauração de teste.
- **Fora de escopo:** papéis avançados (responsável por risco, diretoria), exportação para terceiros, RPO/RTO definitivos, backup automatizado com retenção longa (Fase 4), política jurídica completa; a rotina que apaga contatos vencidos nasce com a coleção de contatos (SPEC-1-006) e lê o prazo registrado aqui.
- **Entradas e pré-condições:** acesso do cliente ao Skip e ao Maestro; e-mails do Country Manager e do administrador; regras aprovadas na task “Aprovar as regras de uso dos contatos” (para contato real).
- **Saídas/artefatos:** projetos Skip; migrações e hooks desta SPEC; testes em `07-sistemas/radar-primitivo/testes/`; evidências em `05_entregas/fase-1/SPEC-1-001/`.
- **Dependências e responsáveis:** Primitivo (execução e dados de acesso); consultor (aceite).
- **Atores e permissões mínimas:** `operador` e `admin` como acima; superusuário do Skip só para migração e restauração, nunca para uso diário.
- **Superfícies/arquivos/configurações afetadas:** `pocketbase/migrations/` (coleções `users.papel`, `config`, `auditoria`, `supressoes`, `copias_seguranca`), `pocketbase/hooks/` (auditoria, supressão, retenção, cópia), segredos `SUPRESSAO_SAL` e, depois, `APOLLO_API_KEY`; telas Entrar e Administração.
- **Risco e plano B:** se a restauração falhar, contato real continua bloqueado e a fase não fecha; a operação segue só com dados fictícios.
- **Rollback ou reversão:** migrações têm `down`; cópia anterior permanece até a nova ser restaurada com sucesso.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `users` (auth) | app | `email`, `name`, `papel` (`operador`/`admin`), `ativo` (bool) | cadastro só por `admin`; `listRule`/`viewRule`: próprio registro ou `admin` | — | usuário inativo não autentica |
| `config` | app | `chave` (único), `valor` (json), `atualizado_por` | leitura: logado; escrita: `admin` | upsert por `chave` | valor ausente bloqueia a função dependente com mensagem |
| `auditoria` | app | `usuario`, `acao`, `colecao`, `registro_id`, `resumo` (antes/depois, sem valor de contato), `criado` | criação só por hook; leitura `admin`; `updateRule` e `deleteRule` nulos | append-only | falha ao auditar faz a ação crítica falhar (não há ação sem trilha) |
| `supressoes` | app | `chave_hash` (HMAC-SHA256 com `SUPRESSAO_SAL` do e-mail/telefone normalizado ou id da pessoa no fornecedor), `tipo`, `motivo`, `criado_por`, `criado` | criação/leitura `admin`; operador só cria pedido de não contato; ninguém apaga | índice único em `chave_hash` | repetição não duplica |
| `copias_seguranca` | app | `arquivo` (file, JSON), `colecoes`, `contagens` (json), `hash`, `gerado_por`, `restaurado_em_teste` (data), `resultado_restauro` | somente `admin` | uma cópia por execução; nome com data/hora | falha de geração marca `falhou` e alerta o admin |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | requisição sem login | 401/403; nenhum dado retornado | nenhuma | RQ-016 |
| RN-02 | operador tenta tela/ação de `admin` | negado e registrado na auditoria | nenhuma | RQ-016 |
| RN-03 | qualquer rota vai gravar pessoa/contato ou gastar crédito com uma chave que existe em `supressoes` | a verificação de supressão responde `true`; quem chamou não grava o contato nem gasta crédito | nenhuma | DC-010, RQ-016 |
| RN-04 | prazo de guarda aprovado | gravado em `config` como `retencao_contatos_dias` (número inteiro de dias); sem esse valor, `config.contato_real_liberado` continua `false` | prazo ainda não aprovado → contato real não entra | G-02 |
| RN-05 | ação crítica (ativar perfil, decisão de fila, contato manual, supressão, cópia, consumo de crédito, alteração de usuário) | linha em `auditoria` | nenhuma | RQ-016 |
| RN-06 | restauração | após importar, reaplicar `supressoes` antes de liberar o uso | nenhuma | RQ-019 |

## Fluxo e regras

1. Criar o projeto Skip `radar-primitivo`, o segredo `SUPRESSAO_SAL` (texto aleatório de 32+ caracteres gerado na hora) e as coleções desta SPEC com as cinco regras de acesso definidas.
2. Cadastrar o Country Manager e o administrador em produção; usuários de teste existem só em `radar-primitivo-teste`; desligar cadastro público nos três projetos.
3. Criar os hooks de auditoria (`onRecordAfterCreateSuccess`/`UpdateSuccess`/`DeleteSuccess` com as coleções críticas como tags). Cada SPEC seguinte que criar coleção crítica acrescenta a tag dela nesse hook.
4. Criar a verificação de supressão: rota interna `POST /backend/v1/supressao/verificar` (somente `admin` e hooks) que recebe e-mail, telefone ou id da pessoa no fornecedor, normaliza (e-mail em minúsculas e sem espaços; telefone só dígitos com DDI 55; id como texto), calcula `$security.hs256(valor, SUPRESSAO_SAL)` e responde se a chave existe. As SPECs de contatos e de Apollo chamam essa mesma lógica antes de gravar ou consumir crédito. Registrar em `config` o prazo de guarda aprovado e a chave `contato_real_liberado` (só vira `true` depois do CA-1-04).
5. Criar a rota protegida `POST /backend/v1/admin/copia` (somente `admin`) que exporta em JSON todas as coleções do app que já existirem (perfis, fontes, execuções, empresas, origens, scores, pessoas, contatos, consumo de créditos, supressões, fila, decisões, eventos, `config` e `auditoria`), grava em `copias_seguranca` com contagens e hash, e a rota `POST /backend/v1/admin/restaurar` no projeto `radar-primitivo-restauro` (mesmas migrações) que importa o arquivo, reaplica supressões e devolve contagens.
6. Depois que as coleções de pessoas e contatos existirem com dados fictícios em `radar-primitivo-teste`, gerar a cópia nesse projeto, restaurar em `radar-primitivo-restauro` (com o mesmo `SUPRESSAO_SAL` do projeto de origem), comparar contagens e confirmar que nenhuma chave suprimida voltou. Só então gravar `config.contato_real_liberado = true` no projeto de produção.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Country Manager logado como `operador` | acessa perfis, fila e ficha; não vê Administração | — |
| Limite | operador chama rota de `admin` | 403 e linha de auditoria | — |
| Falha | sem login | 401 em qualquer coleção | — |
| Principal | e-mail suprimido aparece em nova carga | contato não gravado; pessoa `suprimido` | auditoria registra a tentativa |
| Falha | restauração com contagem divergente | `resultado_restauro = divergente`; contato real segue bloqueado | corrigir e repetir antes de qualquer contato real (SPEC-1-006 e SPEC-1-007) |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC e o que já existir em `07-sistemas/radar-primitivo/`; os guias de hooks e de migrações do Skip.
2. **Alterar somente:** os três projetos Skip desta SPEC, as coleções e hooks listados aqui, os testes e as evidências desta SPEC.
3. **Não alterar:** outros projetos Skip do cliente; não criar cadastro público; não gravar segredo em arquivo; não enviar nada para fora do app.
4. **Executar nesta ordem:** projeto e segredo → coleções com regras → usuários → auditoria → supressão → retenção (pausada) → cópia → restauração de teste → provas.
5. **Parar e pedir validação quando:** faltar o e-mail de um usuário, a task de regras de uso não estiver concluída e alguém quiser carregar contato real, a restauração divergir ou alguma regra de acesso exigir abrir dado a quem não está logado.
6. **Estado válido ao parar:** app acessível só com login, auditoria funcionando e nenhum contato real carregado.

## Checklist de execução

- [ ] projetos `radar-primitivo`, `radar-primitivo-teste` e `radar-primitivo-restauro` criados com o mesmo `SUPRESSAO_SAL`
- [ ] cinco regras de acesso definidas em cada coleção desta SPEC
- [ ] Country Manager e administrador cadastrados; cadastro público desligado
- [ ] auditoria registrando as ações críticas
- [ ] supressão bloqueando reintrodução (e sem gasto de crédito)
- [ ] prazo de guarda aprovado registrado em `config`; `contato_real_liberado` permanece `false` até o CA-1-04
- [ ] cópia gerada e restaurada no projeto de teste com contagens iguais
- [ ] evidências anexadas em `05_entregas/fase-1/SPEC-1-001/`

## Critérios de aceite

- [ ] **CA-1-01:** sem login nenhuma coleção retorna dado; operador não acessa ações de `admin`.
- [ ] **CA-1-02:** cada ação crítica da RN-05 gera exatamente uma linha em `auditoria`, que não pode ser editada nem apagada.
- [ ] **CA-1-03:** a verificação de supressão responde `true` para e-mail, telefone ou id suprimido em qualquer formato equivalente, nenhuma linha de `supressoes` pode ser apagada, e o prazo de guarda aprovado está registrado em `config`.
- [ ] **CA-1-04:** a cópia restaurada em `radar-primitivo-restauro` tem as mesmas contagens por coleção e nenhuma chave suprimida volta; só depois disso `config.contato_real_liberado` vira `true`.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `acesso.test.mjs`: requisição anônima e de operador às coleções/rotas de admin | `node --test 07-sistemas/radar-primitivo/testes/acesso.test.mjs` antes das regras | testes falham (dado acessível) — CA-1-01 | saída do teste em `05_entregas/fase-1/SPEC-1-001/red.txt` |
| RED | `supressao.test.mjs`: suprimir `Fulano@Exemplo.com ` e verificar `fulano@exemplo.com`; tentar apagar a supressão | mesmo comando para o arquivo | verificação responde `false` ou exclusão aceita (falha esperada) — CA-1-03 | `red.txt` |
| GREEN | mesmos testes + `auditoria.test.mjs` (alterar `config` e criar usuário geram 1 linha cada; editar/apagar auditoria → 403) | `node --test 07-sistemas/radar-primitivo/testes/` | todos passam — CA-1-01, CA-1-02, CA-1-03 | `green.txt` |
| REFACTOR/REGRESSÃO | `copia.test.mjs`: gerar cópia em `radar-primitivo-teste`, restaurar em `radar-primitivo-restauro`, comparar contagens e supressões; rodar a suíte de novo; rodar a parte anônima de `acesso.test.mjs` contra produção (`RADAR_URL_PRODUCAO`, somente leitura) | `node --test …/copia.test.mjs` com `RADAR_URL_RESTAURO` | contagens iguais; zero chave suprimida reintroduzida — CA-1-04 | `restauro.json` com contagens + `green.txt` |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; dois usuários de teste (`operador.teste`, `admin.teste`), 3 e-mails e 2 telefones fictícios (um de cada suprimido, em formatos diferentes), 1 perfil fictício e, para a cópia, os registros fictícios das demais SPECs; variáveis `RADAR_URL`, `RADAR_URL_RESTAURO`, `RADAR_OPERADOR_EMAIL/SENHA`, `RADAR_ADMIN_EMAIL/SENHA` fora do repositório.  
**Caminhos de erro obrigatórios:** sem login, papel insuficiente, auditoria indisponível, chave suprimida, restauração divergente.  
**Evidência exigida:** saídas RED/GREEN, `restauro.json`, captura da tela de Administração com a cópia restaurada.

## Teste humano do cliente

- **Origem:** não aplicável nesta SPEC (o aceite humano da jornada fica na SPEC-1-007).

## Handoff e operação

- **Como demonstrar:** logar como operador e tentar abrir Administração; mostrar a auditoria de uma ação; mostrar a cópia restaurada.
- **Como operar depois:** o administrador gera uma cópia antes de cada carga grande e semanalmente; supressões entram pela Administração.
- **Como monitorar:** falha de cópia ou de auditoria aparece no painel de Administração e no log do Skip.
- **Pendência conhecida:** backup automatizado com retenção e RPO/RTO ficam para a Fase 4 (G-08).

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| e9431482-e860-4567-a7a5-2686aa2fc09a | Criar o app no Skip com login e papéis de acesso | Primitivo | SPEC-1-001 | CA-1-01, CA-1-02 | RED/GREEN de acesso e auditoria | `green.txt` | acesso ao Skip |
| b1e92f2a-04ac-42f4-a6db-ecaec10ae7b4 | Criar o projeto do app no Skip | Primitivo | SPEC-1-001 | CA-1-01 | projeto e segredo criados | captura do projeto | acesso ao Skip |
| e1ebe3ff-e63e-489b-ad40-181920495c85 | Cadastrar o Country Manager e o administrador | Primitivo | SPEC-1-001 | CA-1-01 | login dos dois papéis | captura do login | e-mails dos usuários |
| 9cddfbf9-a0ec-41f0-b032-81f34994695c | Bloquear telas e dados para quem não tem acesso | Primitivo | SPEC-1-001 | CA-1-01 | `acesso.test.mjs` GREEN | `green.txt` | coleções criadas |
| 9c0d46c5-ceda-4f24-998b-c0ebf24dc805 | Registrar o histórico das ações importantes | Primitivo | SPEC-1-001 | CA-1-02 | `auditoria.test.mjs` GREEN | `green.txt` | coleções criadas |
| 3de24d80-34be-4b4e-8184-4657bec6f4b5 | Aprovar as regras de uso dos contatos | Primitivo | SPEC-1-001 | CA-1-03 (pré-condição) | regras registradas em `config` | mensagem/registro da aprovação | G-02 |
| f29d5193-aec5-42ec-9ac9-9b528cec32ba | Definir quem pode ver e editar contatos no app | Primitivo | SPEC-1-001 | CA-1-01 (pré-condição) | papéis confirmados | registro da decisão | — |
| 501bd0d0-578c-4dd9-9a37-5f993145e0c0 | Definir o prazo de guarda dos contatos | Primitivo | SPEC-1-001 | CA-1-03 (pré-condição) | valor em `config.retencao_contatos_dias` | registro da decisão | — |
| 73becc1c-83b1-447f-a30e-8e1bfd4f7f1a | Definir como tratar pedido de não contato | Primitivo | SPEC-1-001 | CA-1-03 (pré-condição) | fluxo de supressão confirmado | registro da decisão | — |
| da111830-3e39-4b1b-aa96-09f995a21d0e | Ativar a lista de bloqueio de contatos | Primitivo | SPEC-1-001 | CA-1-03 | `supressao.test.mjs` GREEN; prazo em `config` | `green.txt` + captura | regras de uso aprovadas |
| 9b89e7d8-fe97-4822-85bf-7fd73babe694 | Testar a cópia de segurança e a restauração dos dados | Primitivo | SPEC-1-001 | CA-1-04 | `copia.test.mjs` GREEN | `restauro.json` | cópia gerada |
| 97edf1d9-f3cd-434a-baf6-ac7f53e7e5ac | Gerar a cópia de segurança dos dados do app | Primitivo | SPEC-1-001 | CA-1-04 | cópia com contagens e hash | registro em `copias_seguranca` | todas as coleções da Fase 1 com dados fictícios |
| 7df5f753-2ce9-4b93-94bd-c378d10f0b4a | Restaurar a cópia em um projeto de teste e conferir | Primitivo | SPEC-1-001 | CA-1-04 | contagens iguais; supressões reaplicadas; `contato_real_liberado = true` | `restauro.json` | projeto `radar-primitivo-restauro`; pessoas/contatos fictícios criados |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
