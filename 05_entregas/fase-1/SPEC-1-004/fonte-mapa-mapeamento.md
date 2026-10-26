# Verificação técnica — fonte pública do MAPA (SIPEAGRO/Fertilizantes)

Data: 26/10/2026 · Pré-requisito da task 8f422530 (aprovação da fonte). A decisão de uso real é do champion; esta é a verificação técnica que o Maestro devia fazer antes.

## Acesso
- URL do arquivo: https://dados.agricultura.gov.br/dataset/52a01565-72d6-410e-b21b-64035831a7be/resource/e0bbc9d5-f161-448b-a6d4-c7beb312ec33/download/sipeagrofertilizante.csv
- O portal REJEITA TLS de clientes não-navegador (curl/fetch do servidor falham com unexpected EOF). Via navegador o arquivo baixa normalmente (~2,85 MB). Implicação: a rotina real precisa baixar via navegador headless ou proxy com TLS de navegador — não com fetch simples.
- Metadados via API CKAN (package_show): last_modified 25/10/2026, url_type upload, licença Creative Commons Attribution (uso permitido com atribuição).

## Leiaute (confirmado no arquivo)
- Separador ; · UTF-8 · CRLF · cabeçalho: UF;MUNICIPIO;NUMERO_REGISTRO_ESTABELECIMENTO;STATUS_DO_REGISTRO;CNPJ;RAZAO_SOCIAL;NOME_FANTASIA;AREA_ATUACAO;ATIVIDADE;CLASSIFICACAO
- CNPJ mascarado (**.***.***/****-**) — guardar como veio em cnpj_mascarado; nunca reconstruir (CA-1-16).
- Mapeamento para fontes.config: uf→UF, municipio→MUNICIPIO, cnpj_mascarado→CNPJ, razao_social→RAZAO_SOCIAL, situacao→STATUS_DO_REGISTRO, atividade→ATIVIDADE (+AREA_ATUACAO e CLASSIFICACAO em atividades).

## Cobertura (medida no arquivo de 25/10)
- 15.884 linhas de dados · 14.091 ativas · 7.172 ativas nas 5 UFs do perfil (MG/SP/RS/PR/PE) · 3.751 nomes distintos ativos no perfil.
- Por atividade (ativos): COMERCIANTE 8.203 · PRODUTOR 3.610 · IMPORTADOR 1.984 · EXPORTADOR 293.
- Qualidade: 113 linhas sem razão social (viram exceção com motivo); ~3.498 linhas com registro de estabelecimento repetido (a consolidação por nome+UF resolve); 1.382 grupos nome+UF com 2+ linhas.
- Aderência ao perfil: distribuidores/comerciantes/importadores de fertilizantes presentes em volume (ex.: proplanta agro comercial PE, TREVOSUL RS, COMAPE MG).
- Os 5 prospects excluídos (Goplan, Modarc, Dedeagro, PMX, Agromol) e maus exemplos (Belagricola, Lavoro, Sagra) aparecem na base — o filtro de contas_excluidas do perfil já cobre.

## Riscos e pendências
- O filtro de UFs do perfil cobre 5 estados; os termos de segmento não filtram a base oficial (a base é toda do setor de fertilizantes — a nota da SPEC-1-005 separa depois).
- Baixa via navegador headless precisa estar na rotina (não fetch direto).
- Aprovação de uso real: pendente do champion (pergunta simples enviada).
