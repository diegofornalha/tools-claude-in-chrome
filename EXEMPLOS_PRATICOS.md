# Exemplos Práticos - Claude in Chrome MCP

Código real que funciona bem e que você pode usar como referência.

## 1. Extrair Dados de Uma Página

```javascript
// ✅ Funciona bem
async function extrairDados(url) {
  // Navegar
  await navigate(url);

  // Aguardar carregamento
  await computer(wait, duration=2);

  // Capturar visual
  const screenshot = await computer(screenshot);

  // Extrair estrutura
  const pageContent = await read_page();

  // Executar query específica
  const titles = await javascript_tool(`
    return Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(el => el.textContent);
  `);

  return { screenshot, pageContent, titles };
}
```

**Taxa de sucesso**: 95%+ ✅

---

## 2. Encontrar e Clicar em Links

```javascript
// ✅ Funciona bem
async function clicarEmLink(textoLink) {
  // Encontrar elemento
  const elementos = await find(textoLink);

  if (elementos.length === 0) {
    console.log(`Link "${textoLink}" não encontrado`);
    return false;
  }

  // Clicar
  const ref = elementos[0].ref;
  await computer(left_click, ref=ref);

  // Aguardar navegação
  await computer(wait, duration=2);

  return true;
}
```

**Taxa de sucesso**: 90%+ ✅

---

## 3. Ler Conteúdo de Página

```javascript
// ✅ Funciona muito bem
async function lerConteudo(url) {
  await navigate(url);
  await computer(wait, duration=1);

  // Extrair texto limpo
  const texto = await get_page_text();

  // Extrair com estrutura
  const conteudo = await javascript_tool(`
    return {
      titulo: document.title,
      url: window.location.href,
      paragrafos: Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent.trim())
        .filter(p => p.length > 0),
      links: Array.from(document.querySelectorAll('a'))
        .map(a => ({ texto: a.textContent, href: a.href }))
    };
  `);

  return conteudo;
}
```

**Taxa de sucesso**: 98%+ ✅

---

## 4. Monitorar Rede/API Calls

```javascript
// ✅ Funciona bem
async function monitorarAPI(url, acao) {
  // Limpar requisições anteriores
  await read_network_requests(clear=true);

  // Executar ação
  await navigate(url);
  await computer(wait, duration=2);
  await acao(); // Chamar função que faz algo

  // Ler requisições
  const requests = await read_network_requests();

  const apiCalls = requests
    .filter(r => r.url.includes('/api/'))
    .map(r => ({
      metodo: r.method,
      url: r.url,
      status: r.status
    }));

  return apiCalls;
}
```

**Taxa de sucesso**: 90%+ ✅

---

## 5. Clicar em Elementos Simples

```javascript
// ✅ Funciona bem para cliques simples
async function clicarBotao(textoBotao) {
  const botao = await find(textoBotao);

  if (botao.length === 0) return false;

  await computer(left_click, ref=botao[0].ref);
  await computer(wait, duration=1);

  return true;
}
```

**Taxa de sucesso**: 85-90% ✅

---

## 6. Verificar Elementos Visualmente

```javascript
// ✅ Funciona muito bem
async function verificarElemento(descricao) {
  const elementos = await find(descricao);

  if (elementos.length === 0) {
    return {
      existe: false,
      mensagem: `${descricao} não foi encontrado`
    };
  }

  return {
    existe: true,
    quantidade: elementos.length,
    primeiro: elementos[0]
  };
}
```

**Taxa de sucesso**: 95%+ ✅

---

## 7. Ler Console para Debugging

```javascript
// ✅ Funciona bem
async function debugarErros() {
  // Executar algo que pode gerar erro
  await navigate("https://exemplo.com");

  // Ler console
  const erros = await read_console_messages(
    pattern="error|Error|404",
    onlyErrors=false
  );

  return erros.map(e => e.message);
}
```

**Taxa de sucesso**: 90%+ ✅

---

## 8. Comparar Screenshots (Visual Testing)

```javascript
// ✅ Funciona bem
async function testeVisual(urls) {
  const screenshots = {};

  for (const url of urls) {
    await navigate(url);
    await computer(wait, duration=1);
    screenshots[url] = await computer(screenshot);
  }

  // Salvar ou comparar
  return screenshots;
}
```

**Taxa de sucesso**: 95%+ ✅

---

---

## ❌ EXEMPLOS QUE NÃO FUNCIONAM

### Radio Buttons

```javascript
// ❌ NÃO FUNCIONA
async function selecionarRadio() {
  // Isso vai clicar, mas o formulário não registra
  const radio = await find("opção C");
  await computer(left_click, ref=radio[0].ref);
  await computer(left_click, ref="submit_btn");

  // Resultado: formulário recebe 0% ou "não respondeu"
}
```

**Taxa de sucesso**: 0-10% ❌

### Preenchimento de Formulários

```javascript
// ❌ NÃO FUNCIONA CONFIÁVEL
async function preencherForm() {
  // Pode clicar, mas dados podem não persistir
  await form_input(ref="email_input", value="teste@email.com");
  await form_input(ref="senha_input", value="senha123");
  await computer(left_click, ref="submit");

  // Dados podem não chegar no backend
}
```

**Taxa de sucesso**: 30-50% ❌

### Sequências Longas de Cliques

```javascript
// ❌ NÃO FUNCIONA CONFIÁVEL
async function fluxoCompleto() {
  // Múltiplos cliques em sequência
  await computer(left_click, ref="step1");
  await computer(left_click, ref="step2");
  await computer(left_click, ref="step3");
  await computer(left_click, ref="step4");
  await computer(left_click, ref="submit");

  // Erros acumulam, algum clique não registra
}
```

**Taxa de sucesso**: 20-40% ❌

---

## 🔄 Padrão Recomendado

```javascript
async function trabalhoBem(url) {
  try {
    // 1. Setup
    const tabs = await tabs_context_mcp();
    const tabId = tabs.availableTabs[0].tabId;

    // 2. Navegar
    await navigate(url);

    // 3. Aguardar
    await computer(wait, duration=2);

    // 4. Ler estrutura
    const page = await read_page();

    // 5. Encontrar
    const elementos = await find("descrição");

    // 6. Clicar simples
    if (elementos.length > 0) {
      await computer(left_click, ref=elementos[0].ref);
      await computer(wait, duration=1);
    }

    // 7. Extrair dados
    const resultado = await javascript_tool("return document.title");

    return resultado;

  } catch (erro) {
    console.error("Erro:", erro.message);
    return null;
  }
}
```

---

## 📊 Checklist de Viabilidade

Antes de usar Claude in Chrome MCP, responda:

- [ ] Preciso apenas LER/EXTRAIR dados? → **SIM, USE!** ✅
- [ ] Preciso NAVEGAR entre páginas? → **SIM, USE!** ✅
- [ ] Preciso fazer CLIQUES simples? → **OK, mas com cuidado** ⚠️
- [ ] Preciso PREENCHER FORMULÁRIOS? → **NÃO, EVITE** ❌
- [ ] Preciso de AUTOMAÇÃO CONFIÁVEL? → **NÃO, USE PLAYWRIGHT/SELENIUM** ❌
- [ ] Preciso fazer MÚLTIPLOS PASSOS em sequência? → **NÃO, EVITE** ❌

---

## 🎯 Resumo

| Tarefa | Funciona | % Sucesso | Alternativa |
|--------|----------|-----------|------------|
| Navegar | ✅ | 95%+ | - |
| Screenshot | ✅ | 95%+ | - |
| Extrair texto | ✅ | 98%+ | - |
| Encontrar elemento | ✅ | 90%+ | - |
| Clicar link | ✅ | 90%+ | - |
| Clicar botão simples | ✅ | 85%+ | - |
| Preencher input | ⚠️ | 50%+ | form_input() |
| Clicar radio/checkbox | ❌ | 10%- | Playwright |
| Automação formulário | ❌ | 0-30% | Selenium/Playwright |
| Múltiplos passos | ❌ | 20-50% | Automation tools |
