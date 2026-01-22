# Quick Reference - Claude in Chrome MCP

Cheat sheet para uso rápido.

## Setup Inicial

```javascript
// Sempre começar com isto
const tabs = await tabs_context_mcp();
const tabId = tabs.availableTabs[0].tabId;
```

## Operações Principais

### Navegação
```javascript
await navigate("https://exemplo.com");
await navigate("back");      // voltar
await navigate("forward");   // avançar
```

### Captura Visual
```javascript
const ss = await computer(screenshot);
```

### Leitura de Página
```javascript
const page = await read_page();                    // árvore DOM
const page = await read_page(filter="interactive"); // só interativos
const texto = await get_page_text();               // texto puro
```

### Encontrar Elementos
```javascript
const elems = await find("login button");
if (elems.length > 0) {
  const ref = elems[0].ref;
  const x = elems[0].ref; // referência interna
}
```

### Clicar
```javascript
// Via referência (mais confiável)
await computer(left_click, ref="ref_5");

// Via coordenadas
await computer(left_click, coordinate=[100, 200]);

// Via elemento encontrado
const elem = await find("botão");
await computer(left_click, ref=elem[0].ref);
```

### JavaScript
```javascript
const result = await javascript_tool("return document.title");
```

### Preencher Input (⚠️ pode não funcionar)
```javascript
await form_input(ref="ref_10", value="texto");
```

### Esperar
```javascript
await computer(wait, duration=2);
```

### Ler Console
```javascript
const logs = await read_console_messages(pattern="error");
```

### Ler Network
```javascript
const requests = await read_network_requests(urlPattern="/api/");
```

### Scroll
```javascript
await computer(scroll, coordinate=[800, 400], scroll_direction="down", scroll_amount=3);
```

### Hover
```javascript
await computer(hover, coordinate=[100, 200]);
```

## Taxa de Sucesso

| Operação | % | Recomendação |
|----------|---|--------------|
| `navigate()` | 95% | ✅ Use |
| `screenshot()` | 95% | ✅ Use |
| `read_page()` | 98% | ✅ Use |
| `find()` | 90% | ✅ Use |
| `left_click()` | 85% | ⚠️ Cuidado |
| `form_input()` | 50% | ❌ Evite |
| Radio/Checkbox | 5% | ❌ Não funciona |
| Formulários | 0% | ❌ Não funciona |

## Fluxo Recomendado

```javascript
// 1. Setup
const tabs = await tabs_context_mcp();
const tabId = tabs.availableTabs[0].tabId;

// 2. Navegar
await navigate(url);
await computer(wait, duration=2);

// 3. Capturar visual
const ss = await computer(screenshot);

// 4. Ler estrutura
const page = await read_page();

// 5. Encontrar
const elems = await find("descrição");

// 6. Interagir (cuidado!)
if (elems.length > 0) {
  await computer(left_click, ref=elems[0].ref);
  await computer(wait, duration=1);
}

// 7. Extrair resultado
const resultado = await javascript_tool("return algo");
return resultado;
```

## Debugging Rápido

```javascript
// O que deu errado?
const screenshot = await computer(screenshot);
const page = await read_page();
const console = await read_console_messages();
const network = await read_network_requests();
```

## Padrão Seguro

```javascript
try {
  // seu código
} catch (erro) {
  // refresh context
  await tabs_context_mcp();
  // tentar novamente ou desistir
}
```

## SOS - O Que Fazer Quando Não Funciona

1. ✅ Tire um screenshot
2. ✅ Use `read_page()` para ver estrutura
3. ✅ Tente `find()` com descrição genérica
4. ✅ Se for formulário → **use Playwright**
5. ✅ Se for click simples → **tente JavaScript direto**

## Não Fazer

- ❌ Radio buttons/checkboxes
- ❌ Múltiplos cliques em sequência
- ❌ Preencher muitos campos
- ❌ Esperar que funcione primeiro try
- ❌ Automação crítica/importante

## Fazer

- ✅ Leitura de dados
- ✅ Navegação
- ✅ Screenshots
- ✅ Extrair informações
- ✅ Testes visuais

---

**Mais detalhes**: veja `README.md`, `EXEMPLOS_PRATICOS.md`, `TROUBLESHOOTING.md`
