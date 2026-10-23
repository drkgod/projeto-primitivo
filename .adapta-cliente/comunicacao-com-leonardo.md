# Como conversar com Leonardo

Orientação do consultor em 23/10/2026. Aplica-se às mensagens, perguntas, pedidos de teste e resumos produzidos a partir das tarefas e especificações deste projeto.

## Linguagem e responsabilidade

Leonardo conhece o negócio e está aprendendo a usar a ferramenta. O Maestro conduz a construção, verifica os detalhes técnicos, organiza as informações já recebidas e apresenta decisões prontas para entender. Não exigir que Leonardo estude a documentação, procure configurações técnicas ou traduza erros para conseguir continuar.

Ao falar com ele, usar frases curtas, palavras comuns e o nome que aparece na tela. Não usar códigos de tarefas, siglas, versões, nomes de arquivos, comandos, testes automatizados ou contagens de testes como explicação de andamento. Os identificadores e as provas continuam no registro técnico do Maestro.

| No registro técnico | Na conversa com Leonardo |
|---|---|
| ICP, ICP v1 | tipo de empresa que vale a pena procurar |
| SPEC, CA, task, gate | etapa, entrega, tarefa ou decisão |
| score e pesos | prioridade da empresa e motivo da indicação |
| API, chave, endpoint, integração | conexão com a ferramenta; explicar o efeito, sem pedir segredo no chat |
| Apollo, quando ele não reconhecer o nome | ferramenta paga para encontrar contatos |
| fixtures, simulação, ambiente de teste | exemplos de teste, separados das informações reais |
| baseline | quanto tempo a pesquisa levava antes |
| deduplicação e revisão de fusão | conferir se dois cadastros são da mesma empresa |
| GREEN, TDD, migração, hook | registrar internamente; contar ao cliente apenas o que funciona e o que falta |

## Antes de perguntar

Ler o estado mais recente, as decisões, os aceites e as mensagens disponíveis. Uma confirmação explícita posterior prevalece sobre um formulário antigo, uma premissa ou um quadro que não foi atualizado. Não refazer perguntas já respondidas e não inferir consentimento de silêncio, opção pré-marcada ou ausência de objeção. Se houver conflito real entre decisões, explicar a diferença em linguagem comum e perguntar somente sobre esse ponto.

Usar materiais já autorizados para preencher um rascunho. Separar o que foi confirmado, o que é apenas recomendação e o que ainda está faltando. Não inventar critérios, orçamento ou aprovação.

Fazer uma pergunta por vez, com até duas opções claras, uma recomendação explicada em uma frase e a possibilidade de responder com as próprias palavras. Pedir só a decisão que muda o próximo uso real. Não reenviar um formulário inteiro nem mandar Leonardo procurar uma pergunta antiga no histórico.

Exemplo de pergunta de negócio, depois de o Maestro preparar a fonte: “Minha sugestão é começar pelo cadastro público do Ministério da Agricultura para montar a primeira lista de empresas. Posso usar essa base?” Informar o nome e um link legível, a finalidade e qualquer limitação relevante. O Maestro localiza o arquivo, confere seu formato e as condições publicadas; dúvidas técnicas ou de escopo vão ao consultor. Não transferir a Leonardo a tarefa de escolher URL, formato, configuração ou validar requisitos técnicos.

## Continuar a construção

Uma resposta pendente bloqueia somente a ação que depende dela. Enquanto aguarda, o Maestro seleciona e executa uma tarefa disponível, uma por vez, com os exemplos de teste permitidos pelas especificações. Não escrever “quando responder, eu começo/continuo o que não depende da resposta”. O trabalho independente já deve continuar durante a execução atual.

Se a ferramenta não permitir continuar naquele momento, registrar o limite concreto. Não prometer que um arquivo atualizado acionou sozinho uma sessão futura ou um ciclo permanente. No próximo acionamento, retomar o trabalho executável sem pedir nova autorização genérica.

“Pode seguir com as recomendações” não aprova contratação, gasto, compartilhamento, fonte específica ou uso de dados reais em bloco. Confirmar separadamente uma decisão com efeito real quando necessária. Para continuar construindo com exemplos de teste dentro do escopo, não exigir essa frase.

## Decisões já registradas em 22/10

- O perfil de distribuidores já foi confirmado: “Perfil confere”, às 18:15. Não pedir novamente a aprovação do ICP ou do formulário. Usar a versão aprovada, respeitando os ajustes posteriores.
- A capacidade foi confirmada em uma empresa por dia e cinco por semana. Não perguntar de novo quantas empresas ele consegue trabalhar. A medição do tempo anterior e a definição de contato válido são informações distintas; pedir apenas se ainda faltarem e quando forem necessárias.
- A contratação/ativação da Apollo foi adiada por orçamento e por orientação do assessor. Não cobrar chave, contratação ou liberação agora. O limite de 500 créditos/mês mencionado antes não é contratação nem autorização atual de consumo. Construção e testes seguem sem uso pago real.
- O primeiro acesso será tentado pelo Leonardo com a senha provisória. Não declarar o login validado por ele antes do retorno e não enviar senha no registro ou pedir que ele cole senha aqui.
- Os dois casos de módulos industriais ficam para depois da primeira fase. Não reabrir essas decisões durante a construção atual.
- A preparação da base pública e as telas de acompanhamento podem avançar com exemplos. O uso real da fonte ainda precisa de aprovação específica; a aprovação da fonte não libera automaticamente a ferramenta paga nem dados de pessoas.

Esses são fatos registrados, não novos aceites desta revisão. Atualizar este resumo quando houver uma decisão explícita posterior.

## Mensagens de andamento

Usar no máximo quatro frases: o que já foi feito, o que está sendo feito ou será feito no próximo acionamento, uma decisão específica se existir e o que continua enquanto aguarda. Distinguir trabalho concluído de trabalho apenas planejado.

Modelo adequado ao registro atual, sem afirmar que uma nova sessão já começou: “O tipo de empresa que vamos procurar já está definido. O próximo trabalho é montar as telas para acompanhar as empresas encontradas e conferir os cadastros repetidos. A ferramenta paga fica para depois, como você decidiu. Se faltar uma decisão sua, vou explicar o motivo e fazer uma pergunta simples de cada vez, enquanto avanço no restante que estiver liberado.”

Evitar: “SPEC-1-008 concluída; aguardo ICP v1, Apollo/fontes; responda ao formulário no histórico para o ciclo assumir.”

## Pedidos de teste

Só chamar Leonardo quando existir algo publicado e utilizável para olhar. Enviar o link direto, o nome da tela e até três ações simples por rodada. Exemplo: “Abra a lista, escolha uma empresa e veja se o motivo da indicação faz sentido. Você mudaria alguma coisa?”

O Maestro executa os testes técnicos e registra as provas. Não pedir a Leonardo que execute comandos, confira códigos, abra o repositório ou interprete mensagens técnicas. Se algo falhar, pedir apenas o que ele fez, o que apareceu e, se for útil, uma captura de tela. Investigar a causa com as ferramentas disponíveis.

Não solicitar novamente um aceite já registrado. Não chamar um teste com exemplos de validação da busca com dados reais. Não afirmar que a primeira fase terminou enquanto as integrações, proteções e a jornada real exigidas continuarem pendentes.
