# Aceite e testes · Beta 0.2

A revisão atual de 23/10/2026 está detalhada em [Diagnóstico, métricas e 15 critérios do briefing](REVISAO-BETA-02.md). A execução de referência é [39972455186](https://github.com/Fr-Abdel/LM-Advocacia-/actions/runs/39972455186), aprovada em Chromium 151.0.7922.34 e Firefox 153.0. Os relatórios de browser, Lighthouse e dependências estão em `docs/evidence/`.

## Critérios funcionais

| ID | Critério | Estado |
| --- | --- | --- |
|A01|Seis páginas e links/recursos íntegros|Aprovado;97 links/recursos locais|
|A02|Marca fictícia e ausência de canais reais|Aprovado na revisão|
|A03|Rejeição de dados inválidos|Aprovado;8 testes unitários e fluxo de erros|
|A04|Prévia, edição e limpeza|Aprovado nos dois motores; exemplo e contador também verificados|
|A05|Sem overflow horizontal|Aprovado; 84 combinações em 320–1920 px, com 42 capturas revisadas|
|A06|Teclado e foco|Aprovado no percurso automatizado; tabulação manual integral recomendada|
|A07|Leitor de tela|Pendente de NVDA/VoiceOver; axe não certifica conformidade integral|
|A08|Conteúdo e navegação sem JS|Aprovado no percurso testado; formulário desativado|
|A09|Sem envio ou persistência da aplicação|Aprovado no código e na observação do fluxo local|
|A10|Pacote e 404 compatíveis|Aprovado na raiz e na simulação de subpasta; verificação externa é executada na main|

A auditoria axe inclui WCAG 2 A/AA, 2.1 A/AA e 2.2 A/AA e encontrou zero violações nos 12 scans das seis páginas em 360/1440 px. Isso não constitui certificação de WCAG. Lighthouse mede laboratório; INP real não foi medido. A meta SEO 95 não foi atingida por `noindex` intencional.

## Roteiro manual reproduzível

Executar em navegador atual no desktop e em pelo menos um aparelho móvel real. Registrar navegador, versão, tamanho de tela, data e eventuais falhas. Para dados de teste usar `Maria Exemplo`, `pessoa@example.com` e “Gostaria de entender a análise de um contrato inteiramente fictício.”

| ID | Procedimento | Resultado esperado |
| --- | --- | --- |
| M01 | Revisar todas as páginas em 320, 360, 390, 768, 1024, 1440 e 1920 px; rolar até o rodapé | Sem corte de texto, sobreposição ou rolagem horizontal. Formulário, menu e botões cabem na tela |
| M02 | Recarregar no desktop; usar somente Tab, Shift+Tab e Enter | Primeiro link permite pular ao conteúdo; ordem segue o layout; foco visível; todas as páginas acessíveis |
| M03 | Em 390 px abrir menu, navegar com Tab e fechar com Escape; abrir novamente e mudar a largura entre 760/761 px | Estado expandido corresponde ao menu; Escape devolve foco ao botão; nenhum foco fica oculto ao voltar ao móvel |
| M04 | Enviar formulário vazio; acionar links do resumo; preencher com nome de 1 caractere, e-mail inválido e mensagem de 19 caracteres | Resumo recebe foco, mensagens associadas aos campos aparecem e prévia não abre |
| M05 | Abrir contato pelo link de uma área; usar dados válidos e marcar confirmação | Área correta já selecionada; prévia mostra os valores; foco vai para resultado; texto diz que nada foi enviado |
| M06 | Abrir DevTools > Network e Storage; gerar, editar e limpar uma prévia | Nenhuma requisição causada pelo formulário; nenhum cookie ou Web Storage criado pelo código; limpeza remove prévia e campos |
| M07 | Gerar prévia com texto `<img src=x onerror=alert(1)>` dentro de mensagem válida; editar; gerar e limpar | Texto é exibido literalmente, nada executa; editar preserva dados; limpar apaga tudo e foca nome |
| M08 | Desativar JS e recarregar início, atuação e contato | Links visíveis, FAQs nativas abrem; aviso explica formulário indisponível e campos ficam desativados |
| M09 | Em HTTPS/localhost, clicar “Copiar prévia”; testar permissão negada quando o navegador permitir | Cópia só após clique; sucesso anunciado; falha informa seleção manual; se API indisponível, botão fica oculto |
| M10 | Com NVDA/Firefox ou VoiceOver/Safari, percorrer formulário, gerar erros e depois uma prévia | Rótulos, obrigatoriedade e erros compreensíveis; foco do resumo e do resultado anunciado; fluxo sem armadilha |
| M11 | No GitHub Pages, abrir todas as páginas, áreas com âncoras, recursos e caminho inexistente como `inexistente/exemplo` | Sem recursos 404 nas páginas existentes; página personalizada recupera navegação e carrega estilos no caminho do projeto |
| M12 | Aplicar zoom de 200% e 400% em janela desktop de 1280 px e preferência de movimento reduzido | Conteúdo reorganiza sem perda de controle ou informação; rolagem animada é desativada |
| M13 | Testar Chrome/Edge e Firefox atuais, além de Safari/iOS se disponível | Formulário e navegação mantêm funcionamento equivalente; diferenças visuais não impedem uso |

Não marcar a beta como visualmente revisada ou totalmente acessível antes de concluir os casos correspondentes. Lighthouse e axe podem ajudar posteriormente, mas não substituem teclado e leitor de tela.

## Registro de execução e pendências

| Casos | Evidência desta rodada |
| --- | --- |
|M01|Sete larguras e seis páginas nos dois motores; capturas Chromium revisadas|
|M02–M03|Skip link, menu, Tab, Escape e foco na troca 760/761 px automatizados|
|M04–M07|Erros, área, prévia literal, edição, limpeza e ausência de envio/persistência aprovados|
|M08|Navegação, FAQ e campos desativados sem JS em 320 px|
|M09|Cópia bem-sucedida e negada simuladas; permissão real não verificada|
|M10|Pendente de NVDA/VoiceOver|
|M11|Pacote na raiz e 404 aninhado; subpasta simulada no runner|
|M12|Movimento reduzido e reflow até320 px; zoom real 200/400% pendente|
|M13|Chromium/Firefox aprovados; Safari/iOS e aparelho físico pendentes|
|M14|Exemplo fictício preenche campos sem marcar confirmação; contador acompanha edição/limpeza|

## Reproduzir

Node.js 22.19 ou superior e Python 3:

```bash
npm ci
npx playwright install --with-deps chromium firefox
npm run check
npm test
python3 tests/check_site.py
npm run build
npm run test:browser
npm run test:performance
```

O build deve preceder os testes de navegador: estes servem o pacote `dist/`. `LIVE_URL` é opcional para incluir verificação da publicação. O CI a define apenas na `main`. Relatórios completos e capturas ficam em `test-results/` e no artefato do Actions por 14 dias; relatórios resumidos e capturas principais também são versionados.

Não afirmar teste em aparelho real, auditoria manual de leitor de tela ou conformidade integral antes da execução pertinente.
