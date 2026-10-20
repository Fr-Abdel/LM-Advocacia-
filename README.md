# LM Advocacia · Beta 0.1

Site institucional **inteiramente fictício**, criado como projeto de portfólio em HTML, CSS e JavaScript. A beta transforma o conceito inicial do repositório em uma experiência navegável com identidade visual, conteúdo, quatro áreas conceituais e contato demonstrativo.

> Não representa um escritório real, não presta orientação jurídica e não encaminha mensagens. Use somente dados fictícios no formulário.

## Proposta e problema resolvido

Para pessoas, famílias e pequenos negócios, a proposta visual é transmitir clareza, cuidado e critério. O visitante consegue entender o posicionamento, explorar áreas de atuação e experimentar uma jornada de primeiro contato sem depender de serviços externos.

Para o portfólio, o projeto demonstra organização de conteúdo, interface responsiva, desenvolvimento estático e tratamento de estados de erro. Não há métricas de clientes, conversão ou resultados comerciais: nenhum desses resultados foi medido.

## Páginas e recursos

| Página | Função |
| --- | --- |
| `index.html` | Proposta, áreas em destaque, jornada conceitual e chamada para contato |
| `escritorio.html` | Posicionamento, princípios e explicação do caráter fictício |
| `atuacao.html` | Quatro áreas, âncoras de navegação e perguntas frequentes |
| `contato.html` | Validação, erros por campo, resumo de erros e prévia sem envio |
| `privacidade.html` | Funcionamento do formulário, ausência de persistência e limites da hospedagem |
| `404.html` | Recuperação de navegação para GitHub Pages no caminho deste repositório |

- Menu móvel com estado anunciado, fechamento por Escape e tratamento de foco ao mudar de largura.
- Navegação e conteúdo disponíveis sem JavaScript; o formulário permanece desativado nesse caso.
- Área de interesse pré-selecionada a partir dos links das áreas.
- Prévia apresentada como texto, com edição, limpeza e cópia opcional em contexto seguro.
- Fontes do sistema, favicon e ilustração SVG autorais locais. Sem CDN, bibliotecas ou instalação obrigatória.
- Link para pular ao conteúdo, foco visível, rótulos, regiões semânticas e preferência por movimento reduzido.
- Metadados por página e `noindex, nofollow` para identificar a demonstração aos buscadores. Isso não é controle de acesso.

## Executar

### Opção imediata

Baixar/clonar o repositório e abrir `index.html` no navegador. Os links usam caminhos relativos compatíveis com a pasta do projeto. A cópia automática da prévia depende do contexto e das permissões do navegador; a seleção manual do texto continua disponível.

### Opção recomendada para revisar a publicação

Na pasta do projeto, com Python instalado:

```bash
python -m http.server 5500
```

Abrir `http://localhost:5500`. No Windows, `py -m http.server 5500` é uma alternativa. Uma extensão de servidor local no VS Code também atende. Não há etapa de build.

**Exceção da página 404:** o `<base>` dessa página aponta para `/LM-Advocacia-/`, caminho previsto no GitHub Pages. Para validá-la fielmente, servir a pasta que contém o projeto com o nome `LM-Advocacia-`, ou ajustar o `<base>` à hospedagem escolhida. As outras páginas funcionam diretamente na raiz ou em subpastas.

## Verificar

Node.js 20 ou superior e Python 3 são necessários apenas para as verificações:

```bash
npm run check
npm test
python tests/check_site.py
```

Nenhum `npm install` é necessário. O workflow em `.github/workflows/quality.yml` executa as mesmas verificações em pushes para `main` e em pull requests. O status remoto precisa ser conferido no GitHub.

Os testes conferem validação e formatação do contato, recursos e âncoras locais, IDs, referências ARIA, semântica básica e sete pares principais de contraste. Não substituem renderização, teste de interação, auditoria de segurança ou conformidade WCAG.

## Organização

```text
LM-Advocacia-/
├── index.html
├── escritorio.html
├── atuacao.html
├── contato.html
├── privacidade.html
├── 404.html
├── assets/
│   ├── architecture.svg
│   ├── favicon.svg
│   ├── css/styles.css
│   └── js/main.js
├── docs/
│   ├── ESCOPO.md
│   ├── ACEITE-E-TESTES.md
│   └── PUBLICACAO.md
├── tests/
│   ├── contact.test.js
│   └── check_site.py
├── .github/workflows/quality.yml
└── package.json
```

As páginas são HTML explícito para facilitar estudo e edição. Cabeçalho e rodapé estão repetidos intencionalmente: alterações nesses elementos precisam ser aplicadas às seis páginas. Cores e tipografia ficam nos tokens no início do CSS; rótulos e validação de contato ficam em `assets/js/main.js`.

## Decisões e limites

A stack acompanha o estágio atual de estudo: HTML semântico, CSS com Grid/Flexbox e JavaScript sem framework. Não há backend, contas, analytics, cookies de aplicação, mapa incorporado ou canal real de contato. Não foram inventados advogados, inscrições profissionais, depoimentos, prêmios, endereços ou resultados.

A direção visual usa vinho, marfim, tons de pedra e tipografia serifada. A ilustração representa passagem, equilíbrio e continuidade; não é fotografia de uma sede.

- [Escopo e decisões](docs/ESCOPO.md)
- [Critérios de aceite, testes manuais e evidências](docs/ACEITE-E-TESTES.md)
- [Roteiro de publicação e próximos incrementos](docs/PUBLICACAO.md)

**Estado da entrega:** código beta preparado para revisão. Publicação da demonstração e verificações visuais ainda precisam ser realizadas conforme os documentos acima.
