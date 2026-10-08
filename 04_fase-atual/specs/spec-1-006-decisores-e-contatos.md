# SPEC-1-006 — Decisores e contatos das empresas aprovadas

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (execução com o Maestro); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-003, DC-004, DC-010; RQ-005, RQ-006, RQ-016 (mínimo), RQ-017; gates G-01 e G-02; critérios da Fase 1 “empresa aprovada executa automaticamente a integração Apollo e recebe candidato ou estado ‘não encontrado’…” e “contato manual preserva origem”  
**Degrau da solução:** nativo da plataforma — rotina agendada e coleções do Skip; toda chamada à Apollo passa pelo módulo da SPEC-1-003; construção mínima só da regra de seleção de pessoas.

## Contexto e decisões fechadas

- **Estado atual:** o Country Manager procura o decisor e o contato de cada empresa por conta própria.
- **Estado desejado:** para cada empresa aprovada na nota, o app busca sozinho os decisores pelos cargos do perfil, escolhe por regra quem enriquecer, revela o contato dentro do teto e deixa tudo pronto na ficha. Quando a Apollo não encontra ou está fora do ar, o gestor registra o contato manualmente, sem apagar o que veio da Apollo.
- **Decisões já fechadas:**
  - busca de pessoas só para empresas `aprovada_pesquisa` (SPEC-1-005); nunca antes do gate;
  - identificação da empresa na Apollo: `apollo_org_id` quando houver; senão o domínio; sem os dois, a empresa fica com pendência “sem identificador para busca de pessoas” e vai para a fila como exceção manual;
  - filtros da busca: títulos das famílias de cargo do perfil (`person_titles[]`) e senioridades (`person_seniorities[]`), até 10 resultados;
  - seleção por regra: ordem das famílias no perfil, depois ordem das senioridades; seleciona até `perfil.pessoas_por_empresa` (padrão 1, máximo 3);
  - enriquecimento só das selecionadas, só e-mail profissional (`reveal_personal_emails: false`); telefone somente se o perfil tiver o canal `telefone`, recebido pela rota de retorno da Apollo protegida por token;
  - “contato válido”: pessoa com cargo de uma família do perfil e ao menos um canal não marcado como inválido pela Apollo, dentro de `config.medicao.validade_contato_dias` (definido pelo cliente na task de medição da SPEC-1-007);
  - nenhuma busca real de pessoas enquanto `config.contato_real_liberado` não for `true` (depende da restauração testada na SPEC-1-001);
  - rotina `contatos_diario` com `cronAdd("contatos_diario", "0 9 * * 1-5", …)` (UTC = 06:00 de Brasília) e `retencao_diaria` com `cronAdd("retencao_diaria", "0 6 * * *", …)`.
- **Bloqueios:** chamadas reais dependem da liberação da Apollo (SPEC-1-003), das regras de uso dos contatos e da restauração testada (SPEC-1-001) e da definição de contato válido (task de medição da SPEC-1-007). Até lá, tudo roda em modo simulado.

## Resultado observável

Ao abrir a ficha de uma empresa aprovada, o Country Manager vê o decisor escolhido, cargo, e-mail (e telefone, se pedido), origem “Apollo” com data e créditos gastos — ou o aviso “Apollo não encontrou decisor” com o botão para registrar o contato manual.

## Limites e dependências

- **Inclui:** coleções `pessoas` e `contatos`; campo `pessoas_por_empresa` no perfil; preenchimento de `resultado_pessoas`/`pessoas_buscadas_em` da empresa (campos criados na SPEC-1-004); rotina diária; seleção por regra; enriquecimento; rota de retorno de telefone; inclusão manual com motivo; divergência entre manual e Apollo; rotina de guarda.
- **Fora de escopo:** envio de mensagem ou e-mail, LinkedIn automatizado, validação externa de e-mail por outro fornecedor, histórico de abordagem (Fase 2).
- **Entradas e pré-condições:** empresas aprovadas (SPEC-1-005); módulo Apollo e teto (SPEC-1-003); supressão, prazo de guarda e restauração testada (SPEC-1-001); definição de contato válido e validade (SPEC-1-007).
- **Saídas/artefatos:** pessoas e contatos com origem; evidências em `05_entregas/fase-1/SPEC-1-006/`.
- **Dependências e responsáveis:** Primitivo (execução); Apollo (cobertura).
- **Atores e permissões mínimas:** rotina grava; `operador` vê contatos, seleciona outra pessoa, pede enriquecimento manual (passa pelo teto) e registra contato manual; `admin` também; anônimo nada.
- **Superfícies/arquivos/configurações afetadas:** migração (coleções desta SPEC, campos novos), `pocketbase/hooks/contatos.pb.js`, `pocketbase/hooks/retencao.pb.js`, rota `POST /backend/v1/apollo/telefone`, segredo `WEBHOOK_SAL`, tags de auditoria, bloco “Decisores e contatos” da ficha.
- **Risco e plano B:** cobertura baixa no agro → aviso “não encontrado” por empresa e contato manual com motivo; isso não substitui o aceite da integração.
- **Rollback ou reversão:** `APOLLO_MODO = simulado` ou pausa interrompe; contatos têm origem e podem ser removidos por execução com auditoria; migração com `down`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| Apollo — busca de pessoas (módulo SPEC-1-003) | Apollo | corpo: `organization_ids[]` ou `q_organization_domains_list[]`, `person_titles[]`, `person_seniorities[]`, `per_page: 10`; leitura: `id`, `name`, `title`, `seniority`, `linkedin_url` (somente exibição) | módulo | chave = empresa + perfil + data | zero resultado → `resultado_pessoas = nao_encontrado`; erro → conforme SPEC-1-003 |
| Apollo — enriquecimento (módulo SPEC-1-003) | Apollo | corpo: `id` da pessoa, `reveal_personal_emails: false`, `reveal_phone_number` só com canal telefone (+ `webhook_url` com token); leitura: e-mail, status do e-mail | módulo | chave = pessoa + data | sem e-mail → contato `nao_encontrado`; erro → SPEC-1-003 |
| Rota `POST /backend/v1/apollo/telefone` | Apollo | telefone por pessoa; `token` = `$security.hs256(pessoa_id, WEBHOOK_SAL)` | token obrigatório; senão 403 | repetição do mesmo número não duplica | pessoa inexistente/suprimida → ignora e registra |
| `pessoas` | app + retorno original | `empresa`, `perfil`, `nome`, `cargo`, `senioridade`, `familia_cargo`, `linkedin_url`, `apollo_person_id`, `origem` (`apollo`/`manual`), `motivo_manual`, `estado` (`candidato`/`selecionado`/`enriquecimento_solicitado`/`valido`/`nao_encontrado`/`invalido`/`desatualizado`/`suprimido`/`pendente_redistribuicao`), `coletado_em` | leitura logado; escrita rotina e ações da ficha | índice único (`empresa`, `apollo_person_id`) quando houver id | — |
| `contatos` | app + retorno original | `pessoa`, `tipo` (`email`/`telefone`), `valor`, `origem`, `status_fonte`, `obtido_em`, `validade_ate`, `expirado`, `creditos`, `divergencia_com`, `motivo_manual` | leitura logado; escrita rotina e ações da ficha | índice único (`pessoa`, `tipo`, `valor`, `origem`) | valor suprimido → não grava |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | empresa não está `aprovada_pesquisa` | nenhuma chamada de pessoas | aprovação manual auditada (SPEC-1-005) | RQ-005 |
| RN-02 | pessoa não selecionada | não é enriquecida | `operador` pede enriquecimento de outra pessoa (passa pelo teto e fica auditado) | RQ-006 |
| RN-03 | e-mail, telefone ou id da pessoa suprimido | não grava, não enriquece, estado `suprimido` | nenhuma | RQ-016 |
| RN-04 | contato manual diferente do da Apollo | grava os dois; `divergencia_com` aponta um ao outro; a ficha mostra os dois | nenhuma | DC-010 |
| RN-05 | contato com `obtido_em` + `retencao_contatos_dias` vencido | apaga `valor`, `expirado = true` | sem prazo aprovado → rotina não roda e contato real segue bloqueado | G-02 |
| RN-06 | `contato_real_liberado != true` e modo real | rotina não chama a Apollo e registra o motivo | modo simulado continua | escopo da Fase 1 |

## Fluxo e regras

1. Migração das coleções e campos; tags de auditoria; segredo `WEBHOOK_SAL`.
2. Rotina `contatos_diario`: empresas `aprovada_pesquisa` sem busca no dia → checar liberação → busca de pessoas → gravar candidatos (checando supressão) → selecionar por regra → enriquecer selecionadas → gravar contatos → marcar `valido` ou `nao_encontrado`.
3. Rota de retorno de telefone com token.
4. Ficha: bloco “Decisores e contatos” (escolhido, outros candidatos, contatos com origem/data/créditos, divergências) e ações “Escolher outra pessoa”, “Pedir contato desta pessoa”, “Adicionar contato manual” (motivo: `apollo_nao_encontrou`, `apollo_indisponivel`, `correcao`).
5. Rotina `retencao_diaria` lendo `config.retencao_contatos_dias`.
6. Provas em modo simulado; depois da liberação, a primeira volta real acontece na jornada com dados autorizados (SPEC-1-007).

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | empresa aprovada com `apollo_org_id` | candidatos, 1 selecionado, e-mail gravado com créditos | — |
| Limite | Apollo sem pessoas para os cargos | `nao_encontrado` registrado | contato manual com motivo |
| Falha | teto atingido no meio da rotina | restantes ficam `bloqueado_teto`; nada corrompido | próxima janela de teto ou ajuste aprovado |
| Limite | e-mail retornado está suprimido | não grava; pessoa `suprimido` | — |
| Limite | contato manual diferente do Apollo | os dois visíveis com divergência | gestor escolhe qual usar |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/`, o módulo `pocketbase/hooks/lib/apollo.js` e a verificação de supressão da SPEC-1-001.
2. **Alterar somente:** coleções, campos, rotinas, rota e bloco de tela desta SPEC, testes e evidências.
3. **Não alterar:** o módulo Apollo, o teto, a nota e o gate; não enviar mensagem; não abrir o LinkedIn por automação.
4. **Executar nesta ordem:** migração → seleção por regra (função pura) → rotina em modo simulado → rota de telefone → ficha e manual → guarda → provas.
5. **Parar e pedir validação quando:** `contato_real_liberado` não estiver `true` e alguém pedir dado real, faltar a definição de contato válido, o perfil não tiver família de cargo, ou a cobertura real ficar abaixo do que o cliente aceitou na amostra.
6. **Estado válido ao parar:** nenhuma pessoa enriquecida fora da regra; nenhum contato suprimido gravado.

## Checklist de execução

- [ ] coleções, campos e segredo criados
- [ ] seleção por regra testada
- [ ] rotina diária em modo simulado
- [ ] rota de telefone com token
- [ ] ficha com decisores, contatos, manual e divergência
- [ ] rotina de guarda lendo o prazo aprovado
- [ ] evidências em `05_entregas/fase-1/SPEC-1-006/`

## Critérios de aceite

- [ ] **CA-1-24:** empresa em `aprovada_pesquisa` dispara automaticamente a busca de pessoas e fica com candidatos ou com “não encontrado” registrado.
- [ ] **CA-1-25:** só as pessoas selecionadas pela regra são enriquecidas, dentro do teto; cada enriquecimento registra créditos, origem e data.
- [ ] **CA-1-26:** contato manual guarda origem e motivo e não sobrescreve o retorno da Apollo; a divergência fica visível.
- [ ] **CA-1-27:** contato suprimido nunca é gravado nem enriquecido; contatos vencidos têm o valor apagado pela rotina de guarda.
- [ ] **CA-1-28:** sem `contato_real_liberado = true`, nenhuma busca real de pessoas acontece.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `contatos.test.mjs` (simulado): empresa fora do gate, empresa aprovada com 4 candidatos, empresa sem pessoas, e-mail suprimido, manual divergente, liberação desligada | `node --test 07-sistemas/radar-primitivo/testes/contatos.test.mjs` antes da rotina | chamadas indevidas ou contatos gravados (falha esperada) — CA-1-24 a CA-1-28 | `05_entregas/fase-1/SPEC-1-006/red.txt` |
| GREEN | mesmo arquivo com a rotina pronta | mesmo comando | 0 chamada fora do gate; 1 selecionado e 1 enriquecimento; `nao_encontrado`; suprimido não gravado; divergência visível; liberação desligada bloqueia modo real — CA-1-24 a CA-1-28 | `green.txt` |
| REFACTOR/REGRESSÃO | `retencao.test.mjs` com contato vencido; teto atingido no meio da rotina; suíte completa | `node --test 07-sistemas/radar-primitivo/testes/` | valor apagado; restantes `bloqueado_teto`; suíte verde | `green.txt` |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; `apollo_simulacoes` de pessoas e enriquecimento; perfil com 2 famílias de cargo; 1 e-mail suprimido; `retencao_contatos_dias` de teste = 1.  
**Caminhos de erro obrigatórios:** fora do gate, sem identificador, zero pessoas, teto, supressão, divergência, liberação desligada, token inválido na rota de telefone.  
**Evidência exigida:** RED/GREEN e captura da ficha com decisor, contato, origem e créditos (simulado; a captura real vem na SPEC-1-007).

## Teste humano do cliente

- **Origem:** não aplicável nesta SPEC (o Country Manager valida decisores e contatos reais no roteiro de aceite da SPEC-1-007, `CL-PEND-006`).

## Handoff e operação

- **Como demonstrar:** abrir uma empresa aprovada e mostrar o decisor e o contato com origem; abrir uma “não encontrado” e registrar um contato manual.
- **Como operar depois:** a rotina roda sozinha às 06:00; o gestor só age nas exceções.
- **Como monitorar:** taxa de “não encontrado” e créditos por contato válido (SPEC-1-007).
- **Pendência conhecida:** validação externa de e-mail fica para avaliação na Fase 4, se a qualidade da Apollo não bastar.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| d698d805-a136-48ae-b853-eae5fdbf4a66 | Buscar decisores e revelar contatos das empresas aprovadas | Primitivo | SPEC-1-006 | CA-1-24, CA-1-25, CA-1-28 | GREEN de `contatos.test.mjs` em modo simulado | `green.txt` | gate pronto; módulo Apollo |
| 1350feb2-6a4e-492b-9ea3-773c02b0a52c | Buscar decisores pelos cargos do perfil | Primitivo | SPEC-1-006 | CA-1-24 | busca e seleção por regra | `green.txt` | perfil com famílias de cargo |
| 42786d0f-3989-4e10-9ea6-a17e00c66bf5 | Revelar contatos só das pessoas escolhidas | Primitivo | SPEC-1-006 | CA-1-25, CA-1-27 | enriquecimento só de selecionadas; supressão | `green.txt` | seleção pronta; teto configurado |
| 25a87e59-9976-4166-be0b-5ae420f4632b | Aplicar o prazo de guarda aos contatos | Primitivo | SPEC-1-006 | CA-1-27 | `retencao.test.mjs` | `green.txt` | prazo aprovado em `config` |
| 4027f1a9-d205-42da-9389-ca9e8c846d38 | Registrar contato manual quando a Apollo não encontrar | Primitivo | SPEC-1-006 | CA-1-26 | manual com motivo e divergência | `green.txt` + captura | bloco da ficha pronto |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
