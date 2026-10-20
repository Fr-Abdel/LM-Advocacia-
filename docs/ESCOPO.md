# Escopo da beta 0.1

## Ponto de partida e resultado

O repositório continha somente o README: “Conceito totalmente fictício para um escritório inventado, apenas para criar prática”. Não havia implementação nem pull request aberto na inspeção inicial.

O incremento entrega um site estático institucional completo, com navegação entre páginas e uma experiência de contato demonstrativa. A meta verificável é permitir que um visitante identifique o caráter fictício, encontre uma área e gere uma prévia válida sem envio.

## Posicionamento adotado

- Público conceitual: pessoas, famílias e pequenos negócios.
- Ideia central: clareza para decidir e cuidado para seguir.
- Tom: sóbrio, próximo, informativo e sem promessas de resultado.
- Frentes: Civil e Contratos; Família e Sucessões; Empresarial; Relações de Consumo.
- Identidade: vinho `#4b222d`, papel `#f8f5ee`, texto `#29251f`, apoio `#665f55`.
- Tipografia: Georgia para títulos; Segoe UI/Arial para texto e controles.
- Elemento visual: ilustração arquitetônica SVG autoral; sem suposta sede física.

Essas escolhas são decisões de implementação fáceis de revisar, não preferências atribuídas ao autor do portfólio.

## Fluxo crítico e estados

1. Início → Atuação → área de interesse.
2. Link de contato carrega o assunto correspondente.
3. O visitante lê que a experiência é fictícia e usa dados de exemplo.
4. Campos inválidos geram resumo focável, links para campos e mensagens locais.
5. Dados válidos geram prévia local; o aviso informa que nada foi enviado.
6. Editar mantém o exemplo; limpar remove campos e prévia; copiar depende de ação explícita.

Não há requisição de formulário, persistência de aplicação, anexos ou destinatário configurado. Sem JavaScript, a navegação e as FAQs continuam disponíveis e os campos permanecem desativados. A falha de permissão da área de transferência recebe uma alternativa de cópia manual.

## Incluído e excluído

Incluído: seis páginas estáticas, conteúdo original demonstrativo, identidade, breakpoints, navegação progressiva, validação de interface, metadados básicos, recursos locais, testes de lógica/estrutura e documentação.

Excluído: atendimento, orientação jurídica individual, CMS, blog, backend, banco de dados, agendamento, WhatsApp, coleta de leads, domínio, implementação de SEO para escritório real e publicação automática. O formulário não é um mecanismo de validação de servidor.

## Arquitetura e manutenção

Não há dependências de execução. O navegador lê os arquivos diretamente; o JavaScript é carregado com `defer`. Funções puras de validação são exportadas condicionalmente para os testes Node, sem transformar o site em um projeto de framework.

A repetição do layout em HTML torna os arquivos independentes e legíveis neste estágio. Caso o site cresça significativamente, um gerador estático com templates pode reduzir a manutenção repetida. Não há benefício suficiente para introduzi-lo nesta beta.

## Publicação e reversibilidade

A entrega deve entrar em uma branch de implementação e pull request, permitindo comparar os arquivos antes da integração. Nenhuma configuração de GitHub Pages é alterada nesta etapa. É possível encerrar o pull request para descartar a proposta; após integração, reverter o commit preserva o histórico.

Qualquer transformação em site de um escritório real constitui novo escopo: identidade e profissionais verificados, conteúdo aprovado, regras aplicáveis revisadas e tratamento de dados definido antes de conectar um canal de atendimento.
