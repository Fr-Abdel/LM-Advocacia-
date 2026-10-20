# Aceite e testes da beta

## Evidência da rodada de 20/10/2026

A revisão usa testes reais em navegador no GitHub Actions e inspeção visual das capturas, sem alegar teste em celular físico. O ambiente local não possuía executáveis de navegador; os testes foram executados em runners Ubuntu do GitHub.

| Verificação | Resultado e limite |
| --- | --- |
| Sintaxe: `npm run check` | Passou |
| Lógica do contato: `npm test` | 8 testes, 8 aprovados |
| Estrutura: `python3 tests/check_site.py` | 6 páginas, 96 links/recursos e referências ARIA verificados |
| Contraste | 7 pares principais entre 4,92:1 e 13,99:1; não cobre todos os estados |
| Renderização | Capturas das seis páginas em 320, 390, 768, 1024 e 1440 px revisadas; sem cortes ou sobreposições observadas |
| Navegadores | Chromium e Firefox, execução automatizada; versões e resultados no relatório do Actions |
| Fluxo | Validação, resumo focável, seleção de área, prévia literal, edição e limpeza; ausência de requisições, cookies e Web Storage no fluxo local |
| Teclado | Skip link, ativação do menu, Tab para navegação, Escape, retorno de foco no breakpoint e foco dos erros/resultado verificados |
| Sem JavaScript | Navegação visível, FAQ nativa e formulário desativado verificados em 320 px |
| Área de transferência | Caminho de permissão negada simulado; cópia real bem-sucedida não verificada |
| Publicação | Sites com audiência pública; verificação da URL, páginas, CSS, formulário e 404 aninhado pela suíte |
| Limites | Não executados: leitor de tela, aparelho físico, Safari/iOS e zoom real do navegador |

As capturas são da implementação renderizada, sem mockups. O relatório JSON e as capturas ficam no artefato `browser-evidence` do workflow; a retenção automática é de 14 dias. As capturas principais são preservadas também em `docs/images/`. Execução de referência aprovada: [GitHub Actions #39467467567](https://github.com/Fr-Abdel/LM-Advocacia-/actions/runs/39467467567), commit `6fed47fa33eea8b2bc4128bc7eeb7e89fb86adf3`. Ambiente: Ubuntu, Playwright 1.62.1, Chromium 151.0.7922.34 e Firefox 153.0. O relatório completo é preservado em `docs/evidence/browser-report.json`.

### Defeitos corrigidos

1. O HTML continha espaços como valor padrão do `textarea`. `form.reset()` restaurava esses espaços. O campo agora tem valor padrão vazio; o teste exige limpeza exata.
2. A navegação podia perder foco quando CSS ocultava o menu antes do evento `matchMedia`. A origem do foco agora é acompanhada e o foco retorna ao botão Menu ao entrar no breakpoint móvel. O teste aguarda e confirma o controle visível.
3. O pacote da hospedagem na raiz ajusta a base de `404.html` para `/`, mantendo a origem compatível com `/LM-Advocacia-/` no Pages. Isso permite recuperar estilos e navegação de um caminho aninhado inexistente.

## Critérios objetivos de aceite

| ID | Critério | Estado |
| --- | --- | --- |
| A01 | Páginas e links locais existentes | Aprovado por verificação estática e navegador |
| A02 | Ficção identificada, sem canais reais ou resultados comerciais inventados | Aprovado |
| A03 | Contato rejeita dados inválidos e área manipulada | Aprovado; testes Node e integração |
| A04 | Prévia após validação, edição e limpeza | Aprovado em Chromium e Firefox |
| A05 | Sem rolagem horizontal em 320, 390, 768, 1024 e 1440 px | Aprovado nas seis páginas nos dois motores; capturas Chromium revisadas |
| A06 | Teclado e foco | Aprovado no percurso automatizado descrito; tabulação integral manual permanece recomendada |
| A07 | Anúncios compreensíveis em leitor de tela | Pendente; não é afirmada conformidade WCAG integral |
| A08 | Navegação e conteúdo sem JS | Aprovado no percurso de início, atuação e contato |
| A09 | Sem envio ou persistência de aplicação | Aprovado no código e na observação do fluxo local |
| A10 | Recursos e recuperação de 404 na hospedagem ativa | Aprovado na URL pública; compatibilidade de subpasta validada no servidor de teste |

O aceite vale para **demonstração beta de portfólio**. Uma entrega para operação real exigiria outro escopo, conteúdo aprovado e validações adicionais. Os limites acima devem permanecer visíveis na documentação.

## Roteiro manual reproduzível

Executar em navegador atual no desktop e em pelo menos um aparelho móvel real. Registrar navegador, versão, tamanho de tela, data e eventuais falhas. Para dados de teste usar `Maria Exemplo`, `pessoa@example.com` e “Gostaria de entender a análise de um contrato inteiramente fictício.”

| ID | Procedimento | Resultado esperado |
| --- | --- | --- |
| M01 | Revisar todas as páginas em 320, 390, 768, 1024 e 1440 px; rolar até o rodapé | Sem corte de texto, sobreposição ou rolagem horizontal. Formulário, menu e botões cabem na tela |
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

## Registro da execução e pendências

| Casos | Evidência desta rodada |
| --- | --- |
| M01 | 30 combinações página/largura por motor, sem overflow; capturas Chromium inspecionadas |
| M02–M03 | Percurso parcial automatizado por teclado e troca 760/761 px; revisão manual integral não alegada |
| M04–M07 | Validação, resumo, área, texto literal, edição, limpeza e ausência de envio/persistência automatizados |
| M08 | Navegação, campos desativados e FAQ sem JS em 320 px |
| M09 | Falha de permissão simulada aprovada; cópia real permanece pendente |
| M10 | Pendente de NVDA/VoiceOver |
| M11 | Publicação na raiz e 404 aninhado verificados; subpasta Pages simulada localmente no runner |
| M12 | Movimento reduzido e reflow de 320 px verificados; zoom real de 200/400% pendente |
| M13 | Chromium e Firefox automatizados; Safari/iOS e aparelho físico pendentes |

## Reproduzir a suíte

```bash
npm ci
npx playwright install --with-deps chromium firefox
npm run test:browser
```

Para incluir o smoke test externo, definir `LIVE_URL=https://lm-advocacia-demo.brinyhawk.chatgpt.site` no ambiente. O workflow já faz isso. A suíte serve a origem sob `/LM-Advocacia-/`, grava `test-results/browser-report.json` e falha quando há erro nas verificações. Ela não é uma auditoria de segurança ou uma certificação de acessibilidade.
