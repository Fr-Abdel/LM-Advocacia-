# Revisão da LM Advocacia · Beta 0.2

## 1. Resultado e escopo

Evolução editorial do site existente em HTML, CSS e JavaScript, mantendo a identidade vinho/marfim, os seis HTMLs, a ilustração SVG local e o contato sem envio. Não há dependências de execução no navegador. Ferramentas adicionais servem apenas à auditoria e ao CI.

A revisão visa uma demonstração de portfólio: não representa entrega jurídica real, escritório inscrito, atendimento, geração de leads ou resultados comerciais. O formulário processa somente exemplos locais; não foi conectado a destinatário.

## 2. Diagnóstico e investigação do workflow

Linha de base: `main` em `6e66465d0c8b2fc10f84612ca7b023a22b0936f0`, execução [39489702686](https://github.com/Fr-Abdel/LM-Advocacia-/actions/runs/39489702686) aprovada. O [PR #3](https://github.com/Fr-Abdel/LM-Advocacia-/pull/3) já estava integrado. Não havia falha P0 atual a reproduzir.

| Prioridade | Evidência inicial | Impacto | Tratamento |
| --- | --- | --- | --- |
| P1 | Nome acessível do link da marca omitindo parte do rótulo visível | Relatório detalhado do Lighthouse encontrou `label-content-name-mismatch`, apesar da pontuação ponderada 100 | Nome passa a vir do texto do link; suíte inclui também as regras WCAG 2.1 A e 2.2 A |
| P1 | Campos em `0.9rem` / 14,4 px | Risco de zoom ao focar no Safari/iOS; inspeção física não realizada | Campos em 16 px; alvos e rótulos ampliados |
| P2 | Início com três links para quatro áreas; Empresarial/Consumo reunidos e apontando apenas a Empresarial | Uma frente ficava sem caminho próprio no início | Quatro áreas com títulos, descrições e âncoras correspondentes |
| P2 | Suíte inicial com cinco larguras, máximo 1440 px | Sem evidência nos tamanhos 360/1920 solicitados | Sete larguras, de 320 a 1920, nos dois motores |
| P2 | Ausência de axe/Lighthouse | Contraste estático e testes funcionais não mediam toda a experiência | Auditorias renderizadas e laboratório com relatórios |
| P2 | CI local misturado à disponibilidade da URL pública | Falha de rede externa podia bloquear uma alteração correta no PR | PR testa pacote local; smoke test externo na `main` |
| P2 | Build copiava arquivos sem limpar saída | Arquivos obsoletos poderiam permanecer no pacote | Limpeza do conteúdo de `dist/`, preservando diretório para o supervisor da prévia |
| P2 | Título com quebras rígidas e hierarquia muito alongada; áreas em lista longa | Composição pouco equilibrada em desktop | Título fluido, figura com moldura, grid editorial e ritmo padronizado |
| P3 | Índice de áreas em `div` rotulada | Navegação sem landmark próprio | Elemento `nav`, alvos 44 px e índice persistente em desktop largo |
| P3 | Formulário exigia digitação completa para demonstrar | Atrito na avaliação do portfólio | Exemplo fictício explícito, contador sem anúncios a cada caractere |
| P3 | Sem canonical/og:url; privacidade datada da beta anterior | Compartilhamento e manutenção incompletos | Metadados da demonstração existente; revisão de versão/data |

As falhas históricas de `browser-checks` já haviam sido tratadas: espaços no valor padrão do textarea restaurados pelo reset; perda de foco no breakpoint antes do evento `matchMedia`; uso de `isDisabled()` no fieldset em vez de um controle; e expectativa de URL com `.html` em hospedagem que redireciona para URLs sem extensão. A revisão não remove esses percursos de regressão e não aumenta timeouts para encobrir defeitos.

## 3. Arquivos e decisões técnicas

- `assets/css/styles.css`: tokens de cor/superfície/espaçamento, grid com `minmax(0,…)`, títulos fluidos, controles 16 px, alvos de navegação, foco e movimento reduzido.
- Seis HTMLs: cabeçalho/rodapé coerentes, aviso fictício legível, metadados aplicáveis. `index.html` passa a separar as quatro áreas; `atuacao.html` recebe landmark de índice; `contato.html` recebe exemplo e contador.
- `assets/js/main.js`: fechamento do menu por toque externo e estados acessíveis; preenchimento de dados fictícios, preservando a confirmação explícita; atualização do contador na edição/limpeza.
- `scripts/build-static.mjs`: pacote com apenas HTMLs e assets, limpeza da saída e base 404 própria para raiz ou subpasta. Sem framework, hidratação ou fontes remotas.
- `tests/site-server.cjs`: servidor de teste compartilhado, ligado a 127.0.0.1, com status 404 correto para caminhos desconhecidos.
- `tests/browser.cjs`: pacote `dist/`, sete larguras, Chromium/Firefox, axe, âncoras, exemplo, contador, cópia simulada, teclado, sem JS e proteção contra execução de conteúdo digitado.
- `tests/performance.cjs`: Lighthouse com três amostras mobile da página inicial, uma desktop e uma mobile do contato; relatório com configurações e limites.
- `package.json`, lockfile e workflow: build explícito, ferramentas somente de desenvolvimento e artefatos de evidência.

O layout comum permanece em HTML explícito. A duplicação é pequena e deliberada para manter estudo e edição simples; não foi introduzido framework, CMS ou sistema de templates sem necessidade.

## 4. Design, UX e integridade

A apresentação usa serifas editoriais nos títulos, sans-serif do sistema nos controles e uma escala de espaçamento compartilhada. A figura é uma ilustração abstrata, não fotografia de uma sede. Áreas ganham navegação própria; manifesto, FAQ, contato e rodapé usam o mesmo sistema visual. Animações ficam restritas a feedback de cor e respeitam movimento reduzido.

Permanecem ausentes equipe, OAB, sede, clientes, depoimentos, prêmios, histórico e índices de sucesso. A aplicação não pede anexos nem adiciona serviços de analytics, rastreamento ou cookies. Fontes e SVGs são locais.

A revisão de conteúdo se orienta pelas fontes oficiais consultadas em 23/10/2026:

- [Provimento 205/2021 do CFOAB](https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021): informação objetiva, verdadeira e sóbria, sem promessa de resultado ou indução à contratação.
- [LGPD, texto compilado oficial](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm): atenção à finalidade, necessidade e transparência do tratamento.

Isso documenta decisões técnicas e editoriais; não constitui certificação jurídica ou aprovação da OAB. Um uso por escritório real continua a exigir responsáveis e inscrições verificados, conteúdo aprovado, política própria e revisão jurídica aplicável à operação.

SEO: `noindex, nofollow` permanece intencional. Canonical e Open Graph apontam à demonstração existente. Sitemap e dados estruturados de escritório não foram acrescentados sem necessidade de indexação e identidade real. Numa migração de hospedagem, revisar os metadados absolutos.

## 5. Verificações e métricas

Execução aprovada: [39972455186](https://github.com/Fr-Abdel/LM-Advocacia-/actions/runs/39972455186), código em `087f62e2fd8fbc6e576d907ecef2bb1b20dc2ba3`. Ubuntu do GitHub, Chromium 151.0.7922.34, Firefox 153.0, axe 4.14.0 e Lighthouse 13.5.0. A nova suíte usa o pacote de produção, não apenas o HTML de origem.

| Verificação | Resultado observado |
| --- | --- |
| Instalação / sintaxe / build | Aprovados no CI; saída estática gerada |
| Testes unitários | 8 de 8 aprovados |
| Estrutura | 6 páginas, 97 links/recursos locais e referências ARIA |
| Responsividade | 6 páginas × 7 larguras × 2 motores = 84 combinações, sem overflow horizontal |
| Capturas | 42 capturas Chromium, 320/360/390/768/1024/1440/1920 px; revisão visual concluída sem corte ou sobreposição observados |
| axe | 12 auditorias: seis páginas em 360/1440 px; zero violações nas regras selecionadas WCAG 2 A/AA, 2.1 A/AA e 2.2 A/AA |
| Fluxos | Menu, teclado, âncoras, validação, exemplo, contador, prévia literal, edição, limpeza e cópia simulada aprovados |
| Sem JS / 404 / privacidade | Navegação e FAQ sem JS, campos desativados, 404 raiz/subpasta, zero requisições de formulário e zero persistência de aplicação no percurso |
| Revisão interativa | Navegação institucional e preenchimento/prévia/limpeza também conferidos na prévia supervisionada |

| Lighthouse | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Início mobile, amostra 1 |100|100|100|66|1055,4 ms|0|
| Início mobile, amostra 2 |100|100|100|66|1055,3 ms|0|
| Início mobile, amostra 3 |99|100|100|66|1052,0 ms|0,0648|
| Início desktop |97|100|100|66|1052,5 ms|0|
| Contato mobile |99|100|100|63|904,2 ms|0,0648|

Mediana mobile do início: LCP 1055,3 ms; CLS 0; TBT 0 ms. O CLS máximo observado foi 0,0648. LCP e CLS ficaram dentro dos alvos laboratoriais. INP permanece não verificado. As cinco amostras ultrapassam os alvos de Performance 90, Accessibility 95 e Best Practices 95; SEO 95 não foi atingido. A falha de SEO identificada foi a diretiva intencional de não indexação.

O nome acessível da marca foi corrigido após a primeira amostra; a execução acima já inclui as regras antes ausentes e não apresenta `label-content-name-mismatch`. Os demais diagnósticos de minificação/cache não bloqueiam as metas atingidas. O cache medido é o do servidor local de teste; ele não determina a política do provedor de hospedagem.

Evidências persistidas: `docs/evidence/browser-report.json`, `docs/evidence/lighthouse-beta-02.json` e `docs/evidence/npm-audit-beta-02.json`. Relatórios Lighthouse completos e todas as capturas estão no artefato do Actions por 14 dias. As capturas principais do pacote renderizado são preservadas em `docs/images/`.

A consulta `npm audit` registrou zero vulnerabilidades conhecidas nas 117 dependências auditadas em 23/10/2026. Isso não equivale a ausência universal de vulnerabilidades. Há aviso de depreciação em dependência transitiva de auditoria (`@opentelemetry/sdk-trace-base`), sem dependência dessa biblioteca no site publicado; não foram aplicados overrides incompatíveis apenas para silenciar o aviso.

Lighthouse mede laboratório, em servidor local no runner, com throttling documentado em cada amostra. Não fornece dados reais de usuários. INP não foi deduzido de TBT. O SEO pode ficar abaixo do alvo pela exclusão intencional de indexação; não remover `noindex` para elevar pontuação.

## 6. Critérios de aceite

| ID | Critério do briefing | Estado / evidência |
| --- | --- | --- |
|01|Instalação e build|Aprovado — CI e saída estática|
|02|Testes relevantes|Aprovado — unitários, estrutura, navegadores e auditorias|
|03|Investigação de browser-checks|Aprovado — histórico identificado; sem falha atual reproduzida|
|04|Ausência de erros críticos JS|Aprovado nos percursos automatizados|
|05|Navegação desktop/móvel|Aprovado nos viewports e motores testados|
|06|Ausência de overflow/colisões críticas|Aprovado — 84 combinações e inspeção das 42 capturas|
|07|Elementos interativos|Aprovado no escopo testado; permissão real de cópia permanece pendente|
|08|Contato configurado ou limites documentados|Aprovado — demonstração local explícita; sem destinatário|
|09|Identidade e acabamento|Aprovado na revisão visual desta entrega|
|10|Acessibilidade detectável|Aprovado no escopo automatizado; conformidade integral depende de validação manual|
|11|SEO adequado à demonstração|Aprovado para a natureza fictícia; meta numérica 95 não atingida pelo noindex intencional|
|12|Integridade de dados/credenciais|Aprovado na revisão de conteúdo e código|
|13|Regressões|Aprovado nos percursos; nenhuma regressão conhecida após a rodada|
|14|Preparação para publicação|Aprovado pelo pacote e CI; smoke test externo previsto na main|
|15|Documentação de limites|Aprovado — evidências e pendências discriminadas|

Alvos adicionais: SEO 95 **reprovado como pontuação**, mantido como exceção intencional de produto; INP real **não verificado**; revisão com leitor de tela/aparelho físico **pendente**. Nenhum desses itens é anunciado como aprovado integralmente.

## 7. Limitações e verificação manual

Leitor de tela NVDA/VoiceOver, Safari/iOS, celular físico e zoom real 200/400% não são comprovados pelos testes automatizados. A cópia bem-sucedida/negada na suíte usa simulação da API; uma permissão real de área de transferência depende do navegador do visitante. A prévia permite seleção manual.

A auditoria axe não certifica WCAG 2.2 AA integralmente. Capturas não comprovam todas as possíveis condições de renderização ou interação. Não há métricas de campo, conversão ou atendimento.

## 8. Preparação para publicação

A publicação existente é pública e continua vinculada ao mesmo projeto Sites. O pacote adapta somente a base da 404; caminhos relativos e conteúdo permanecem equivalentes. Nenhuma variável de ambiente de produção é necessária. Credenciais não integram fonte ou pacote.

A entrega está no [PR #4](https://github.com/Fr-Abdel/LM-Advocacia-/pull/4), com código, documentação e capturas versionadas. Publicar somente após o CI aprovado, conservar a versão anterior para reversão e conferir o smoke test externo da main. O resultado da implantação é informado na entrega; os relatórios deste documento correspondem à execução de referência citada.

## 9. Conferência posterior de coerência

Referência do GitHub: `0928375084a11d486610857d6faa76b0509ffa50`. A execução [39974677939](https://github.com/Fr-Abdel/LM-Advocacia-/actions/runs/39974677939), disparada pelo merge da beta 0.2 na `main`, terminou com `static-checks` e `browser-checks` aprovados. O workflow testa o pacote local em PRs **e** pushes; apenas nos pushes acrescenta o smoke test da demonstração em Chromium. O Lighthouse sempre mede o servidor local do runner.

| Camada | Conclusão da conferência |
| --- | --- |
| Código / pacote | Sintaxe, oito testes do contato, estrutura de seis páginas/97 links e build reproduzidos localmente com sucesso |
| Workflow original | Sete larguras e ambos os motores no pacote local; checagem pública reduzida em pushes, sem comprovação anterior de igualdade dos arquivos |
| Publicação | Sites versão 5, implantação concluída em 23/10; dez arquivos correspondentes ao pacote da beta 0.2 |
| Diferença de infraestrutura | Quatro assets idênticos por SHA-256; seis HTMLs preservados com inserção de um script de proteção Cloudflare antes do fechamento do body |
| URLs / 404 | Canonical e Open Graph das páginas principais coerentes com os redirecionamentos sem extensão; caminho inexistente retorna 404 personalizado; noindex preservado |
| Interação pública | Menu/Escape, resumo de erros, exemplo, prévia, edição e limpeza conferidos; cópia real retornou confirmação de sucesso no navegador disponível |
| Responsividade pública | Seis páginas em sete larguras: um H1 e ausência de overflow horizontal no navegador disponível; inspeção visual amostral em desktop e 390 px |

Os SHAs de origem do GitHub e do Sites pertencem a repositórios diferentes. A correspondência foi verificada pelas respostas HTTP, não presumida pela numeração da beta. [Evidência de publicação](evidence/publication-beta-02.json), com timestamp UTC, hashes esperados/servidos e origem identificada.

Correções limitadas à apresentação técnica: README passa a distinguir execução direta e build de publicação; o roteiro manual define o caso M14 que já constava no registro; `npm run test:published` compara todos os arquivos de `dist/` na `main`, rejeita divergências e preserva relatório. Seis testes do comparador protegem contra aceitação indevida de conteúdo antigo, scripts extras ou páginas de erro; os 14 testes totais passaram localmente. Nenhum HTML, CSS, JavaScript da aplicação, dependência ou configuração da hospedagem foi alterado.

Limites mantidos: NVDA/VoiceOver, Safari/iOS, aparelho físico, zoom real 200/400%, negação real de cópia e desempenho público/de campo não foram aprovados por esta rodada. A cópia bem-sucedida agora tem uma observação real, restrita ao navegador utilizado. Os números Lighthouse/axe da seção 5 são históricos identificados, não resultados de uma nova auditoria. INP real continua ausente; SEO 95 continua uma exceção intencional pelo noindex. O script do provedor impede inferir “zero requisições/cookies na hospedagem” a partir dos testes locais do formulário.

A instalação completa das dependências de auditoria não pôde ser repetida neste ambiente: o cache local é incompleto e o terminal não resolve os hosts externos. Foram usados o CI remoto de referência, as verificações locais sem dependências e a inspeção HTTP/interativa pública para discriminar essa limitação de uma falha do produto. A revisão não afirma nova execução local de Lighthouse, axe ou da matriz completa Playwright.
