# Aceite e testes da beta

## Evidência executada nesta entrega

| Verificação | Resultado |
| --- | --- |
| Sintaxe: `npm run check` | Passou |
| Lógica do contato: `npm test` | 8 testes, 8 aprovados |
| Estrutura: `python tests/check_site.py` | 6 páginas e 96 links/recursos locais verificados |
| IDs e referências ARIA/labels | Sem duplicações ou referências ausentes nas verificações estáticas |
| Contrastes principais calculados | 7 pares, todos acima de 4,5:1 |
| Navegador, teclado, leitor de tela, renderização móvel | Não executados; ambiente sem navegador de QA disponível |
| Publicação e GitHub Actions remoto | Não verificados nesta medição local |

Os pares verificados variam de 4,92:1 a 13,99:1. O cálculo usa luminância relativa sRGB. Ele cobre as combinações indicadas no script, não todos os estados de renderização. Semântica estática e contraste não comprovam conformidade integral com WCAG.

## Critérios objetivos de aceite

| ID | Critério | Como verificar | Estado |
| --- | --- | --- | --- |
| A01 | As cinco páginas institucionais existem e todos os links locais resolvem | Script de estrutura | Aprovado no escopo estático |
| A02 | A marca é identificada como fictícia e não oferece canais reais | Leitura das páginas e inspeção de código | Aprovado |
| A03 | O contato rejeita campos vazios, limites excedidos e área manipulada | Testes Node | Aprovado na lógica |
| A04 | A prévia só aparece após validação, sem envio; edição e limpeza funcionam | M04–M07 | Pendente de navegador |
| A05 | Não há rolagem horizontal em 320, 390, 768, 1024 e 1440 px | M01 | Pendente de navegador |
| A06 | Navegação e formulário operam por teclado com foco perceptível | M02 e M04 | Pendente de navegador |
| A07 | Erros, foco e resultado são compreensíveis por leitor de tela | M10 | Pendente de leitor de tela |
| A08 | Conteúdo e navegação continuam acessíveis sem JS | Inspeção e M08 | Implementado; interação pendente |
| A09 | Não há chamada de envio ou persistência implementada | Inspeção de JS e script | Aprovado no código; confirmar M06 |
| A10 | Arquivos e âncoras funcionam sob `/LM-Advocacia-/` após publicação | M11 | Pendente de publicação |

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

## Registro de execução manual

| Caso | Navegador/dispositivo | Resultado | Evidência/observação |
| --- | --- | --- | --- |
| M01–M13 | A preencher na revisão | Pendente | Nenhuma execução manual alegada |
