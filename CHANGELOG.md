# Changelog - Claude in Chrome MCP

Registro historico da evolucao do Claude in Chrome para referencia de longo prazo.

---

## [2026-01-23] - Documentacao Inicial

### Status Atual
- **Versao Claude Code**: cli (via bun)
- **Metodo de conexao**: Extension + Native Host
- **Processo MCP**: `claude --claude-in-chrome-mcp`

### Ferramentas Disponiveis (18 total)

| Ferramenta | Status | Taxa Sucesso |
|------------|--------|--------------|
| `tabs_context_mcp` | Funciona | 98% |
| `tabs_create_mcp` | Funciona | 98% |
| `navigate` | Funciona | 95% |
| `read_page` | Funciona | 95% |
| `read_page(filter: interactive)` | Funciona | 95% |
| `get_page_text` | Funciona | 98% |
| `find` | Funciona | 90% |
| `javascript_tool` | Funciona | 95% |
| `computer(screenshot)` | Funciona | 95% |
| `computer(left_click)` | Funciona | 85% |
| `computer(scroll)` | Funciona | 90% |
| `computer(type)` | Funciona | 80% |
| `computer(hover)` | Funciona | 85% |
| `form_input` | Instavel | 50% |
| `read_console_messages` | Funciona | 90% |
| `read_network_requests` | Funciona | 90% |
| `gif_creator` | Funciona | 95% |
| `resize_window` | Funciona | 95% |

### Limitacoes Conhecidas
- Radio buttons e checkboxes nao funcionam bem (~10%)
- Formularios complexos falham frequentemente (~30%)
- Conexao MCP pode cair e requer reconexao manual
- Processos duplicados podem causar conflito

### Arquitetura
```
Claude Code CLI
    ↓
MCP (Model Context Protocol)
    ↓
Chrome Extension (ponte)
    ↓
Chrome DevTools Protocol (CDP)
    ↓
Chrome Browser
```

### Diferenciais vs CDP Direto
- Integracao com Claude (conversa natural)
- Linguagem natural para encontrar elementos (`find`)
- Sistema de `ref_id` para referenciar elementos
- GIF recording integrado
- Nao requer conhecimento de programacao

### Casos de Uso Recomendados
- Exploracao de sites
- Scraping/extracao de dados
- Debug de aplicacoes web
- Documentacao visual (screenshots, GIFs)
- Leitura de console e network

### Casos NAO Recomendados
- Automacao critica de formularios
- Preenchimento de radio/checkbox
- Automacao de producao/negocios
- Fluxos que requerem 100% confiabilidade

---

## Template para Futuras Entradas

```markdown
## [YYYY-MM-DD] - Titulo da Atualizacao

### Mudancas
- O que mudou

### Novas Ferramentas
- Ferramentas adicionadas

### Melhorias
- O que melhorou

### Deprecacoes
- O que foi removido/alterado

### Bugs Conhecidos
- Problemas identificados

### Notas
- Observacoes gerais
```

---

## Linha do Tempo

| Data | Evento |
|------|--------|
| 2026-01-23 | Documentacao inicial criada |
| 2026-01-23 | Estrutura de clusters organizada |
| 2026-01-23 | Onboarding interativo criado |
| 2026-01-23 | LaunchAgent configurado para auto-start |

---

## Referencias

- Documentacao: `/Users/2a/.claude/tools-claude-in-chrome/`
- Clusters: `./clusters/`
- Demos: `./demos/`
- Plano de aprendizado: `/Users/2a/.claude/plans/tender-honking-tower.md`
