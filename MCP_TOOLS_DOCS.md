# Documentação MCP Tools - Claude in Chrome

Guia rápido das ferramentas de automação do navegador.

---

## 🎯 Sessão Atual

**Tab Real em Funcionamento:**
- **tabId: 2014681288** - Shortcuts Real - Debug Workflow
- URL: `http://127.0.0.1:5500/tools-claude-in-chrome/shortcuts_real.html`
- Status: ✅ Funcionando com workflows reais de debug
- Workflows implementados:
  - 🔍 Debug Console (read_console_messages)
  - 📡 Network Monitor (read_network_requests) - a implementar
  - 🔧 IDE Diagnostics (getDiagnostics) - a implementar

---

## 🎯 Navegação e Contexto

### `tabs_context_mcp`
Obtém informações sobre as abas abertas no grupo MCP atual.
- Retorna: lista de tabs com ID, título e URL
- Use antes de outras operações para saber quais tabs existem

### `tabs_create_mcp`
Cria uma nova aba vazia no grupo MCP.
- Retorna: novo tabId para usar em outras ferramentas

### `navigate`
Navega para uma URL específica ou usa histórico (back/forward).
- Parâmetros: `tabId`, `url`
- Exemplo: `navigate(tabId, "https://google.com")`

---

## 🔍 Leitura de Conteúdo

### `read_page`
Obtém árvore de acessibilidade da página (estrutura DOM simplificada).
- Parâmetros: `tabId`, `depth` (profundidade), `filter` (all/interactive)
- Retorna: elementos com ref_ids para usar em outras ferramentas
- Limite: 50000 caracteres

### `find`
Busca elementos usando linguagem natural.
- Parâmetros: `tabId`, `query` (descrição do elemento)
- Exemplo: `find(tabId, "botão de login")`
- Retorna: até 20 elementos com referências

### `get_page_text`
Extrai texto puro da página (ideal para artigos).
- Parâmetros: `tabId`
- Retorna: conteúdo em texto sem HTML

---

## ⚡ Interação com Página

### `computer`
Controla mouse e teclado (clicks, digitação, scroll, screenshots).
- Ações: `left_click`, `right_click`, `type`, `key`, `scroll`, `screenshot`, `hover`, `zoom`
- Parâmetros: `action`, `tabId`, `coordinate` (x,y)
- Exemplo: `computer("screenshot", tabId)`

### `form_input`
Preenche campos de formulário usando ref_id.
- Parâmetros: `tabId`, `ref` (do read_page/find), `value`
- Suporta: text, checkbox, select

### `javascript_tool`
Executa JavaScript no contexto da página.
- Parâmetros: `tabId`, `text` (código JS)
- Retorna: resultado da última expressão
- NÃO use `return`, apenas escreva a expressão

---

## 📊 Debug e Monitoramento

### `read_console_messages`
Lê mensagens do console do navegador.
- Parâmetros: `tabId`, `pattern` (regex), `onlyErrors`, `limit`, `clear`
- Útil para: debug de JavaScript, ver erros

### `read_network_requests`
Monitora requisições HTTP da página.
- Parâmetros: `tabId`, `urlPattern`, `limit`, `clear`
- Mostra: XHR, Fetch, documentos, imagens

### `mcp__ide__getDiagnostics`
Obtém diagnósticos de linguagem do VS Code.
- Parâmetros: `uri` (opcional, arquivo específico)
- Retorna: erros, warnings, info

---

## 🎬 Gravação e Mídia

### `gif_creator`
Grava ações do navegador e exporta como GIF animado.
- Ações: `start_recording`, `stop_recording`, `export`, `clear`
- Parâmetros para export: `filename`, `download`, `options`
- Recursos: indicadores de click, labels, progress bar

### `upload_image`
Faz upload de screenshot ou imagem do usuário.
- Parâmetros: `tabId`, `imageId`, `ref` ou `coordinate`, `filename`
- Suporta: file inputs e drag & drop

---

## 🔧 Utilidades

### `resize_window`
Redimensiona janela do navegador.
- Parâmetros: `tabId`, `width`, `height`
- Útil para: testar responsividade

### `shortcuts_list`
Lista shortcuts/workflows disponíveis na página.
- Parâmetros: `tabId`
- Retorna: array de shortcuts com comando e descrição

### `shortcuts_execute`
Executa um shortcut em sidepanel.
- Parâmetros: `tabId`, `command` ou `shortcutId`
- Abre sidepanel e executa o workflow

### `update_plan`
Apresenta plano ao usuário antes de executar ações.
- Parâmetros: `domains` (domínios a visitar), `approach` (passos)
- Requer aprovação do usuário

### `mcp__ide__executeCode`
Executa código Python no kernel Jupyter atual.
- Parâmetros: `code`
- Estado persiste entre chamadas

---

## 📝 Padrões de Uso

### Fluxo Básico
1. `tabs_context_mcp` → obter tabs disponíveis
2. `tabs_create_mcp` → criar nova tab (se necessário)
3. `navigate` → ir para URL
4. `read_page` ou `find` → encontrar elementos
5. `computer` ou `form_input` → interagir

### Debugging
1. `read_console_messages` → ver erros JS
2. `read_network_requests` → ver chamadas API
3. `javascript_tool` → executar código debug

### Automação
1. `gif_creator("start_recording")` → iniciar gravação
2. Executar ações (clicks, navegação, etc)
3. `gif_creator("export", download=true)` → salvar GIF

---

## ⚠️ Observações Importantes

- Sempre use `tabs_context_mcp` no início da sessão
- TabIds de sessões anteriores não funcionam
- Screenshots têm IDs únicos (ex: `ss_0173w5bt0`)
- `javascript_tool` não aceita `return` statements
- Coordenadas são em pixels do viewport (x, y)
- `read_page` limita em 50k caracteres (use `depth` menor se necessário)
