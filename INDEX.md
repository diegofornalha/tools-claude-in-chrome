# Claude in Chrome MCP - Indice Geral

Documentacao organizada por clusters de funcionalidades.

## Estrutura

```
tools-claude-in-chrome/
├── INDEX.md                    <- Voce esta aqui
├── README.md                   <- Visao geral e status
├── QUICK_REFERENCE.md          <- Cheat sheet rapido
├── EXEMPLOS_PRATICOS.md        <- Codigo que funciona
├── TROUBLESHOOTING.md          <- Resolucao de problemas
│
├── clusters/                   <- Documentacao por ferramenta
│   ├── navegacao/              <- tabs, navigate
│   ├── leitura/                <- read_page, get_page_text, find
│   ├── execucao/               <- javascript_tool
│   ├── debug/                  <- console, network
│   ├── captura/                <- screenshot, gif
│   └── interacao/              <- click, scroll, type
│
└── demos/                      <- Paginas HTML de demonstracao
    ├── javascript_tool_demo.html
    ├── read_page_demo.html
    ├── shortcuts_real.html
    ├── workflow_console.html
    ├── workflow_javascript.html
    └── workflow_network.html
```

## Mapa de Ferramentas

| Ferramenta | Cluster | Doc | Taxa Sucesso |
|------------|---------|-----|--------------|
| `tabs_context_mcp` | navegacao | [README](clusters/navegacao/README.md) | 98% |
| `tabs_create_mcp` | navegacao | [README](clusters/navegacao/README.md) | 98% |
| `navigate` | navegacao | [README](clusters/navegacao/README.md) | 95% |
| `read_page` | leitura | [README](clusters/leitura/README.md) | 98% |
| `get_page_text` | leitura | [README](clusters/leitura/README.md) | 98% |
| `find` | leitura | [README](clusters/leitura/README.md) | 90% |
| `javascript_tool` | execucao | [README](clusters/execucao/README.md) | 95% |
| `read_console_messages` | debug | [README](clusters/debug/README.md) | 90% |
| `read_network_requests` | debug | [README](clusters/debug/README.md) | 90% |
| `computer(screenshot)` | captura | [README](clusters/captura/README.md) | 95% |
| `gif_creator` | captura | [README](clusters/captura/README.md) | 95% |
| `resize_window` | captura | [README](clusters/captura/README.md) | 95% |
| `computer(left_click)` | interacao | [README](clusters/interacao/README.md) | 85% |
| `computer(scroll)` | interacao | [README](clusters/interacao/README.md) | 90% |
| `computer(type)` | interacao | [README](clusters/interacao/README.md) | 80% |
| `form_input` | interacao | [README](clusters/interacao/README.md) | 50% |

## Ordem de Aprendizado Recomendada

```
1. navegacao  -> Fundamento: como abrir e navegar
2. leitura    -> Fundamento: como extrair informacao
3. execucao   -> Poder: JavaScript customizado
4. debug      -> Util: investigar problemas
5. captura    -> Documentacao: screenshots e GIFs
6. interacao  -> Avancado: clicar, digitar (cuidado!)
```

## Quick Start

```javascript
// 1. Obter contexto de abas
const tabs = await tabs_context_mcp({ createIfEmpty: true });

// 2. Navegar
await navigate({ url: "https://exemplo.com" });
await computer({ action: "wait", duration: 2 });

// 3. Ler pagina
const texto = await get_page_text();
console.log(texto);

// 4. Extrair dados com JavaScript
const titulo = await javascript_tool({ code: "return document.title" });
```

## Demos Disponiveis

| Demo | O que demonstra | Servidor Local |
|------|-----------------|----------------|
| `read_page_demo.html` | Leitura de DOM | `http://127.0.0.1:5501/demos/read_page_demo.html` |
| `javascript_tool_demo.html` | Execucao de JS | `http://127.0.0.1:5501/demos/javascript_tool_demo.html` |
| `workflow_console.html` | Debug de console | `http://127.0.0.1:5501/demos/workflow_console.html` |
| `workflow_network.html` | Debug de network | `http://127.0.0.1:5501/demos/workflow_network.html` |
| `workflow_javascript.html` | JavaScript avancado | `http://127.0.0.1:5501/demos/workflow_javascript.html` |
| `shortcuts_real.html` | Atalhos | `http://127.0.0.1:5501/demos/shortcuts_real.html` |

## O que Funciona vs Nao Funciona

### Funciona Bem (use!)
- Navegacao entre paginas
- Leitura de conteudo
- Extracao com JavaScript
- Screenshots e GIFs
- Debug de console/network
- Cliques simples em botoes/links

### Nao Funciona Bem (evite!)
- Radio buttons / Checkboxes
- Formularios com validacao
- Multiplos campos em sequencia
- Automacao critica de negocios

## Links Uteis

- [README.md](README.md) - Visao geral completa
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Quando algo da errado
- [EXEMPLOS_PRATICOS.md](EXEMPLOS_PRATICOS.md) - Codigo pronto para usar
