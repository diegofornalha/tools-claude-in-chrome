# Cluster: Execucao

Execucao de JavaScript arbitrario na pagina.

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `javascript_tool` | Executar codigo JS na pagina | 95% |

## javascript_tool

Executa codigo JavaScript no contexto da pagina atual.

```javascript
// Obter titulo
const titulo = await javascript_tool({
  code: "return document.title"
});

// Extrair todos os links
const links = await javascript_tool({
  code: `
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({ texto: a.textContent, href: a.href }))
  `
});

// Extrair tabela
const dados = await javascript_tool({
  code: `
    return Array.from(document.querySelectorAll('table tr'))
      .map(row => Array.from(row.cells).map(cell => cell.textContent))
  `
});
```

**IMPORTANTE:** Sempre usar `return` no codigo!

---

## Casos de Uso

### 1. Extracao de Dados

```javascript
// Extrair produtos de e-commerce
const produtos = await javascript_tool({
  code: `
    return Array.from(document.querySelectorAll('.produto'))
      .map(p => ({
        nome: p.querySelector('.nome')?.textContent,
        preco: p.querySelector('.preco')?.textContent,
        link: p.querySelector('a')?.href
      }))
  `
});
```

### 2. Manipulacao de Pagina

```javascript
// Scroll ate elemento
await javascript_tool({
  code: `
    document.querySelector('#secao-importante').scrollIntoView();
    return true;
  `
});

// Destacar elemento (debug visual)
await javascript_tool({
  code: `
    document.querySelector('.botao').style.border = '3px solid red';
    return true;
  `
});
```

### 3. Verificacao de Estado

```javascript
// Verificar se pagina carregou
const ready = await javascript_tool({
  code: "return document.readyState"
});

// Verificar se elemento existe
const existe = await javascript_tool({
  code: "return !!document.querySelector('#login-form')"
});

// Contar elementos
const total = await javascript_tool({
  code: "return document.querySelectorAll('li').length"
});
```

### 4. Interacao via JS (alternativa a cliques)

```javascript
// Clicar via JavaScript (mais confiavel para alguns elementos)
await javascript_tool({
  code: `
    const btn = document.querySelector('button[type="submit"]');
    btn.click();
    return true;
  `
});

// Preencher input via JavaScript
await javascript_tool({
  code: `
    const input = document.querySelector('#email');
    input.value = 'teste@email.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return input.value;
  `
});
```

---

## Padroes Avancados

### Aguardar elemento aparecer

```javascript
const elemento = await javascript_tool({
  code: `
    return new Promise((resolve) => {
      const check = () => {
        const el = document.querySelector('.loading-done');
        if (el) resolve(el.textContent);
        else setTimeout(check, 100);
      };
      check();
      setTimeout(() => resolve(null), 5000); // timeout 5s
    });
  `
});
```

### Extrair dados paginados

```javascript
// Clicar em "carregar mais" e extrair
await javascript_tool({
  code: `
    document.querySelector('.load-more').click();
    return true;
  `
});

await computer({ action: "wait", duration: 2 });

const todosDados = await javascript_tool({
  code: "return Array.from(document.querySelectorAll('.item')).map(i => i.textContent)"
});
```

---

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Retorna undefined | Faltou `return` | Adicionar return no codigo |
| Erro de sintaxe | JS invalido | Verificar codigo em console do Chrome |
| Elemento null | Seletor errado | Usar read_page() para verificar estrutura |
| Promise nao resolve | Codigo assincrono | Usar await ou Promise |
