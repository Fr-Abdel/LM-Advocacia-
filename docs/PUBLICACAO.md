# Publicar a demonstração

## Caminho recomendado: GitHub Pages

O site é estático e não precisa de build, servidor de aplicação ou contratação de hospedagem. Este roteiro pressupõe que o repositório continue público e que GitHub Pages esteja disponível na conta. Os rótulos da interface podem mudar.

1. Revisar o pull request da beta, conferir os arquivos e o resultado do workflow de qualidade.
2. Concluir os testes manuais pertinentes em `ACEITE-E-TESTES.md`, corrigindo falhas antes de divulgar.
3. Integrar a branch em `main`.
4. No repositório, abrir **Settings → Pages**.
5. Selecionar publicação a partir de uma branch: **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salvar.
6. Aguardar a implantação e usar a URL que o GitHub informar. O endereço esperado para este nome de repositório é `https://fr-abdel.github.io/LM-Advocacia-/`; ele só deve ser anunciado como ativo após a implantação ser confirmada.
7. Conferir o caminho do projeto, as seis páginas, os SVGs, CSS/JS, as âncoras e o contato. Testar também um endereço inexistente em subpasta.
8. Adicionar a URL confirmada em **About → Website** do repositório e ao README. Só então apresentar como demonstração publicada.

O workflow `quality.yml` apenas verifica o código. Ele não publica. Nenhuma configuração de Pages foi alterada pela entrega da beta.

## Atenção ao caminho base

Os recursos usam caminhos relativos, adequados ao GitHub Pages de projeto. Não substituir por `/assets/...`, pois isso apontaria para a raiz da conta e perderia `/LM-Advocacia-/`.

Somente `404.html` possui `<base href="/LM-Advocacia-/">` para recuperar estilos e links mesmo em URLs inexistentes mais profundas. Se o repositório for renomeado ou a hospedagem mudar, ajustar essa base. Em um domínio na raiz, usar `<base href="/">`.

As páginas incluem `noindex, nofollow` para reduzir confusão com um escritório real. Manter os avisos de ficção e não cadastrar a marca como empresa real. `noindex` não impede visitas nem garante remoção imediata de índices.

## Tornar a peça apresentável

Após publicar e conferir:

- Adicionar ao README capturas desktop e móvel da versão efetivamente publicada. Não usar mockups como evidência de implementação.
- Registrar um vídeo curto: início → área → contato inválido → prévia → limpeza.
- Apresentar como **projeto autoral fictício**, com problema de interface, decisões, stack e limites. Não atribuir clientes ou conversões à beta.
- Descrever a oferta demonstrada: site institucional com conteúdo organizado, identidade, responsividade e jornada de contato. Resultados reais só entram após medição em trabalho real autorizado.

## Próximos incrementos por prioridade

| Prioridade | Incremento | Evidência de conclusão |
| --- | --- | --- |
| 1 | Revisão real em navegador, teclado e aparelho móvel | Casos M01–M13 registrados; defeitos corrigidos |
| 2 | Publicação e verificação sob o caminho do repositório | URL ativa, recursos carregando e fluxo completo conferido |
| 3 | Capturas e demonstração curta no README | Materiais correspondem à versão publicada |
| 4 | Medição de desempenho e acessibilidade com Lighthouse/axe | Relatório com ambiente, data e limitações; sem pontuação inventada |
| 5 | Extrair aprendizado e documentar decisões técnicas | Explicar Grid/Flexbox, breakpoints, eventos, validação e estado sem depender de leitura da IA |

Um backend de contato só deve entrar quando existir necessidade concreta e operação real definida. Isso exige validação no servidor, proteção contra abuso, destinatário autorizado, política de privacidade própria e tratamento de falhas. Adicionar WhatsApp, e-mail ou formulário externo sem essas definições não melhora esta demonstração.
