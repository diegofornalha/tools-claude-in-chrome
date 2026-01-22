# Troubleshooting - Claude in Chrome MCP

Guia para resolver problemas comuns ao usar Claude in Chrome MCP.

---

## 1. "Tab doesn't exist" ou "Invalid Tab ID"

### Sintomas
```
Error: Tab ID 2014682601 doesn't exist
MCP error: The specified tab is not available
```

### Causas
- Tab foi fechada
- ID expirou
- Nova sessão iniciada

### Solução

**Sempre começar com:**
```javascript
const tabs = await tabs_context_mcp();
console.log("Abas disponíveis:", tabs.availableTabs);
const tabId = tabs.availableTabs[0].tabId;
```

**Se ainda não funcionar:**
```javascript
// Criar nova tab
const novaTab = await tabs_create_mcp();
```

---

## 2. "MCP error -32001: AbortError"

### Sintomas
```
AbortError: This operation was aborted
MCP error -32001
```

### Causas
- Timeout (comando demorou muito)
- Página congela durante operação
- Navegação interrompida
- Falta de conexão

### Solução

```javascript
// Aumentar timeout
try {
  await navigate(url);
  await computer(wait, duration=3); // Aguardar mais tempo
  const page = await read_page();
} catch (erro) {
  if (erro.message.includes("AbortError")) {
    // Tentar novamente
    await tabs_context_mcp(); // Refresh context
    // Retry
  }
}
```

---

## 3. Screenshot Vazio ou Preto

### Sintomas
- Screenshot capturado mas tela vazia/preta
- "Screenshot captured but content is blank"

### Causas
- Página ainda carregando
- JavaScript não executou
- Page em loading state
- Tamanho de janela muito pequeno

### Solução

```javascript
// Aguardar mais tempo
await computer(wait, duration=3);

// Garantir que página carregou
const readyState = await javascript_tool("return document.readyState");
if (readyState !== "complete") {
  await computer(wait, duration=2);
}

// Tirar screenshot
const ss = await computer(screenshot);
```

---

## 4. find() Não Encontra Elemento

### Sintomas
```
Found 0 matching elements
Element not found for: "login button"
```

### Causas
- Texto é muito específico/exato
- Elemento está hidden (display: none, visibility: hidden)
- Elemento está fora da viewport
- Seletor CSS muito restritivo

### Solução

**Opção 1: Tentar descrição mais genérica**
```javascript
// ❌ Muito específico
await find("Clique aqui para fazer login agora");

// ✅ Genérico
await find("login");
await find("button");
```

**Opção 2: Usar read_page para encontrar ref**
```javascript
const page = await read_page(filter="interactive");
// Procurar manualmente na estrutura retornada
```

**Opção 3: JavaScript direto**
```javascript
const elemento = await javascript_tool(`
  return document.querySelector('button[type="submit"]');
`);
```

---

## 5. Clique Não Funciona / Não Registra

### Sintomas
- Elemento clicado mas nada acontece
- Form não registra seleção (radio, checkbox)
- Botão clicado mas ação não executa

### Causas
- Element é decorativo (não é interactive)
- Evento click não dispara handlers
- Radio button/checkbox especial
- Elemento tem z-index negativo

### Solução

**Para cliques simples:**
```javascript
// Método 1: Via ref (mais confiável)
const elem = await find("botão");
await computer(left_click, ref=elem[0].ref);

// Método 2: Via coordenadas
const screenshot = await computer(screenshot);
// Inspecionar screenshot para encontrar coordenada
await computer(left_click, coordinate=[X, Y]);

// Método 3: Via JavaScript
await javascript_tool(`
  document.querySelector('button').click();
  document.querySelector('button').dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );
`);
```

**Para radio buttons (AVISO: pode não funcionar):**
```javascript
// Tentar JavaScript (melhor chance)
await javascript_tool(`
  const radio = document.querySelector('input[value="C"]');
  radio.checked = true;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
  radio.dispatchEvent(new Event('input', { bubbles: true }));
`);
```

---

## 6. Formulário Não Persiste Dados

### Sintomas
- Preencheu input, mas dado desapareceu
- form_input() executou mas campo vazio
- Dados não chegaram no backend

### Causas
- Campo tem validação JavaScript
- Form require confirmação adicional
- Sistema de cache do navegador
- Validação no backend rejeita

### Solução

```javascript
// 1. Verificar se input foi preenchido
const valor = await javascript_tool("return document.getElementById('email').value");
console.log("Valor no input:", valor);

// 2. Disparar eventos específicos
await javascript_tool(`
  const input = document.getElementById('email');
  input.value = 'teste@email.com';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur'));
`);

// 3. Verificar erros no console
const erros = await read_console_messages(pattern="error");
console.log("Erros encontrados:", erros);

// 4. Verificar requisições de network
const requests = await read_network_requests();
console.log("Requisições:", requests);
```

---

## 7. Página Não Carrega ou Timeout

### Sintomas
```
Page not loading
Timeout waiting for element
```

### Causas
- Website bloqueou requisição
- JavaScript pesado
- Infinite loop no site
- Recursos bloqueados

### Solução

```javascript
// 1. Aumentar tempo de espera
await computer(wait, duration=5);

// 2. Verificar se página carregou
const ready = await javascript_tool(`
  return {
    readyState: document.readyState,
    title: document.title,
    bodyLoaded: document.body !== null
  };
`);

// 3. Se não carregou, tentar refresh
if (ready.readyState !== "complete") {
  await javascript_tool("location.reload()");
  await computer(wait, duration=3);
}

// 4. Se ainda não carregar, desistir
const page = await read_page();
if (page.length === 0) {
  console.log("Página não carregou, desistindo");
  return null;
}
```

---

## 8. "You didn't answer this question" (Formulários)

### Sintomas
- Simulado/formulário marca como "não respondido"
- Mesmo após clicar, sistema diz que não respondeu
- 0% de aproveitamento

### Causas
- **Radio buttons não foram realmente selecionados**
- Sistema requer interação real de usuário
- Validação JavaScript falhou
- Form exige clicks específicos

### Solução

**Aceitar que não funciona:**
```javascript
// Para formulários com radio buttons, este MCP não é adequado
// Use Selenium, Playwright ou outra ferramenta
console.log("⚠️ Claude in Chrome MCP não funciona bem com radio buttons");
console.log("Use: Playwright, Selenium, Cypress ou Puppeteer");
```

---

## 9. JavaScript Execution Não Retorna Nada

### Sintomas
```
javascript_tool() returns undefined
Result is null
```

### Causas
- Script não tem return statement
- Código assíncrono não foi aguardado
- Erro no código JavaScript
- Escopo incorreto

### Solução

```javascript
// ❌ Errado (sem return)
await javascript_tool(`
  document.title;
`);

// ✅ Correto (com return)
const titulo = await javascript_tool(`
  return document.title;
`);

// Para código assíncrono
const resultado = await javascript_tool(`
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(document.title);
    }, 100);
  });
`);
```

---

## 10. Console Messages Não Aparecem

### Sintomas
- read_console_messages() retorna vazio
- Não consegue ler erros da página

### Causas
- Console foi limpo
- Padrão não matcheia
- Mensagens ainda não foram logadas

### Solução

```javascript
// Executar algo que gera log
await javascript_tool("console.log('Teste:', 123)");

// Ler sem filtro
const todas = await read_console_messages(pattern=".*");

// Ler apenas erros
const erros = await read_console_messages(onlyErrors=true);

// Padrão personalizado
const custom = await read_console_messages(pattern="Teste|Error|Warning");
```

---

## Checklist de Debugging

Quando algo não funciona, seguir nesta ordem:

- [ ] Verificar Tab ID com `tabs_context_mcp()`
- [ ] Capturar screenshot para ver estado atual
- [ ] Usar `read_page()` para entender estrutura
- [ ] Verificar console com `read_console_messages()`
- [ ] Verificar network com `read_network_requests()`
- [ ] Tentar JavaScript direto em vez de cliques
- [ ] Aumentar tempo de espera com `wait(duration=3+)`
- [ ] Se é formulário complexo, **desistir e usar Playwright**

---

## Padrão Seguro para Debugging

```javascript
async function operacaoSegura(descricao, funcao) {
  try {
    console.log(`[INICIANDO] ${descricao}`);

    // Verificar tabs
    const tabs = await tabs_context_mcp();
    if (!tabs.availableTabs.length) {
      throw new Error("Nenhuma tab disponível");
    }

    const tabId = tabs.availableTabs[0].tabId;

    // Executar
    const resultado = await funcao(tabId);

    // Verificar resultado
    if (!resultado) {
      throw new Error("Resultado vazio");
    }

    console.log(`[SUCESSO] ${descricao}`);
    return resultado;

  } catch (erro) {
    console.error(`[ERRO] ${descricao}: ${erro.message}`);

    // Tentar debug
    try {
      const ss = await computer(screenshot);
      console.log("Screenshot capturado para análise");
    } catch (e) {
      console.error("Não conseguiu capturar screenshot");
    }

    return null;
  }
}

// Usar assim:
const resultado = await operacaoSegura(
  "Extrair título da página",
  async (tabId) => {
    await navigate("https://exemplo.com");
    return await javascript_tool("return document.title");
  }
);
```

---

## Quando Desistir e Usar Outra Ferramenta

Se encontrar **2 ou mais** desses problemas, use **Playwright** ou **Selenium**:

- ❌ Radio buttons/checkboxes não funcionam
- ❌ Múltiplos passos em sequência falhando
- ❌ Formulários não persistem dados
- ❌ Precisa de automação confiável 100%
- ❌ Website tem proteção anti-bot forte
- ❌ Precisa executar JavaScript complexo com state

**Recomendação**: Use Claude in Chrome MCP apenas para **leitura/extração de dados**.
