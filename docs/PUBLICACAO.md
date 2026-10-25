# Publicação e manutenção da demonstração

## Demonstração ativa

URL pública: **https://lm-advocacia-demo.brinyhawk.chatgpt.site/**

Publicada em 20/10/2026 pelo Sites, com acesso público e HTTPS. O repositório GitHub continua como fonte do portfólio. O Pages esperado em `https://fr-abdel.github.io/LM-Advocacia-/` retornava 404 na inspeção; a configuração inicial do Pages não estava disponível no conector. A hospedagem alternativa atende ao escopo sem contratar domínio nem configurar um contato real.

A publicação usa somente os seis HTMLs e `assets/`. Código de testes, documentação e dependências de desenvolvimento não entram no diretório público. O identificador da hospedagem e a pasta estática estão em `.openai/hosting.json`; esse arquivo não contém credenciais.

## Preparar uma versão

```bash
npm run check
npm test
python3 tests/check_site.py
npm ci
npx playwright install --with-deps chromium firefox
npm run build
npm run test:browser
npm run test:performance
```

O comando de build prepara `dist/` para hospedagem na raiz. Ele mantém os caminhos relativos e ajusta somente a base da página 404 para `/`. Publicar a pasta `dist/` pela mesma hospedagem após as verificações; manter o mesmo projeto e acesso público. Fazer um commit no GitHub **não** publica automaticamente no Sites. Para atualizar esta hospedagem com o ChatGPT, solicitar publicação do projeto já identificado em `.openai/hosting.json`; não criar outra cópia do Site.

A publicação pelo Sites salva uma versão e permite voltar a uma versão anterior se um defeito for identificado. No GitHub, usar reversão de commit, preservando o histórico. Revalidar a URL pública depois de cada alteração de HTML, CSS ou JavaScript.

## Alternativa futura: GitHub Pages

Não é necessária para apresentar a demonstração atual. Caso seja escolhida:

1. Abrir Settings → Pages no repositório.
2. Selecionar Deploy from a branch → `main` → `/ (root)` e salvar.
3. Aguardar o workflow de publicação e confirmar a URL informada pelo GitHub.
4. Conferir todas as páginas, recursos e um caminho aninhado inexistente.
5. Atualizar o link de demonstração no README e o campo About → Website.

O `404.html` de origem já usa `/LM-Advocacia-/`, adequado ao Pages deste repositório. Para publicar o pacote em vez da raiz do repositório, executar `node scripts/build-static.mjs /LM-Advocacia-/`. Renomear o repositório exige atualizar esse caminho.

## Apresentação no portfólio

Apresentar como **projeto autoral fictício**: site institucional em HTML, CSS e JavaScript, identidade visual sóbria, navegação responsiva e prévia de contato com estados de erro. As capturas do README provêm do pacote de produção renderizado em Chromium, sem mockups. A revisão 0.2 e suas métricas estão em `REVISAO-BETA-02.md`.

Não declarar escritório atendido, inscrições profissionais, conversões, faturamento ou resultados de clientes. Não há envio, backend ou analytics. Manter `noindex, nofollow` e os avisos de ficção; eles não são controle de acesso.

Próximas melhorias opcionais: validar com NVDA/VoiceOver e aparelho móvel real; avaliar Safari/iOS, zoom real e cópia bem-sucedida; medir desempenho com relatório e ambiente identificados. Um vídeo curto pode complementar as capturas. Nenhum canal real de atendimento deve ser adicionado sem novo escopo e destinatário autorizado.

## Conferir a correspondência da publicação

Após publicar ou ao investigar divergência entre GitHub e Sites, gerar o pacote e comparar seu conteúdo com a URL pública. O comando não instala dependências nem publica:

```powershell
npm run build
$env:LIVE_URL = 'https://lm-advocacia-demo.brinyhawk.chatgpt.site'
npm run test:published
Remove-Item Env:LIVE_URL
```

Em shells POSIX: `LIVE_URL=https://lm-advocacia-demo.brinyhawk.chatgpt.site npm run test:published`.

O relatório `test-results/published-report.json` identifica URL final, status HTTP, hashes SHA-256 e resultado de cada arquivo. Os seis HTMLs são comparados com o pacote da raiz; os quatro assets são comparados integralmente. A hospedagem pode inserir um script Cloudflare antes de `</body>`: o comparador identifica essa única inserção, mantendo a comparação integral do HTML original. Uma alteração desse mecanismo exige investigação; não ampliar a exceção para ocultar divergências. A presença desse script também impede estender a observação local de ausência de requisições/cookies à infraestrutura do provedor.

Na conferência posterior da beta 0.2, a versão Sites **5**, com implantação concluída em 23/10/2026, correspondeu aos dez arquivos públicos de `0928375084a11d486610857d6faa76b0509ffa50`. A origem interna do Sites é `72177531e3cecbcf9ad9a25f7f3d429ea92afaa4`; ela pertence ao repositório da hospedagem e não é um commit do GitHub público. SHAs diferentes entre esses repositórios não provam divergência de conteúdo. Evidência preservada em [publication-beta-02.json](evidence/publication-beta-02.json), com horário UTC.

O workflow mantém PRs sem acesso à demonstração. Em pushes na `main`, executa o smoke test público e a comparação de conteúdo, além dos testes locais. Uma mudança de HTML/CSS/JS ainda não implantada deve falhar na comparação pública; após a implantação validada, repetir o workflow. Indisponibilidade, bloqueio do provedor ou divergência não significam automaticamente defeito no pacote local. O CI não deve ser apresentado como mecanismo de deploy.
