# Cluster: Interacao

Ferramentas para interagir com elementos da pagina (cliques, scroll, digitacao).

**AVISO:** Este cluster tem taxa de sucesso menor. Use com cautela.

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `computer(left_click)` | Clicar em elemento | 85% |
| `computer(scroll)` | Rolar pagina | 90% |
| `computer(type)` | Digitar texto | 80% |
| `computer(hover)` | Hover em elemento | 85% |
| `form_input` | Preencher input | 50% |

## computer(left_click)

Clica em um elemento da pagina.

```javascript
// Via referencia (mais confiavel)
const botao = await find({ description: "submit button" });
await computer({ action: "left_click", ref: botao[0].ref });

// Via coordenadas
await computer({ action: "left_click", coordinate: [100, 200] });
```

**Dicas:**
- Preferir ref em vez de coordenadas
- Aguardar apos clique para acao completar
- Se nao funcionar, tentar javascript_tool como alternativa

---

## computer(scroll)

Rola a pagina em direcao especifica.

```javascript
// Scroll para baixo
await computer({
  action: "scroll",
  coordinate: [800, 400],
  scroll_direction: "down",
  scroll_amount: 3
});

// Scroll para cima
await computer({
  action: "scroll",
  coordinate: [800, 400],
  scroll_direction: "up",
  scroll_amount: 2
});
```

**Parametros:**
- `coordinate`: ponto de referencia [x, y]
- `scroll_direction`: "up", "down", "left", "right"
- `scroll_amount`: quantidade de "passos"

---

## computer(type)

Digita texto no elemento focado.

```javascript
// Primeiro clicar no input
await computer({ action: "left_click", ref: "ref_email_input" });

// Depois digitar
await computer({ action: "type", text: "teste@email.com" });
```

**Dicas:**
- Sempre clicar no input ANTES de digitar
- Usar form_input como alternativa
- Para teclas especiais, usar computer(key)

---

## computer(hover)

Move o mouse sobre elemento (sem clicar).

```javascript
// Hover para abrir menu dropdown
await computer({ action: "hover", coordinate: [100, 200] });
await computer({ action: "wait", duration: 1 });
// Menu deve aparecer
```

---

## form_input

Preenche campo de formulario diretamente.

```javascript
// Preencher input
await form_input({ ref: "ref_10", value: "meu texto" });
```

**AVISO:** Taxa de sucesso ~50%. Preferir javascript_tool para formularios.

---

## Alternativas com JavaScript

Quando interacoes nativas falham, use javascript_tool:

```javascript
// Clique via JS
await javascript_tool({
  code: `
    document.querySelector('button[type="submit"]').click();
    return true;
  `
});

// Preencher input via JS
await javascript_tool({
  code: `
    const input = document.querySelector('#email');
    input.value = 'teste@email.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return input.value;
  `
});

// Scroll via JS
await javascript_tool({
  code: `
    document.querySelector('#secao').scrollIntoView({ behavior: 'smooth' });
    return true;
  `
});

// Selecionar radio button via JS
await javascript_tool({
  code: `
    const radio = document.querySelector('input[value="opcaoA"]');
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    return radio.checked;
  `
});
```

---

## Workflows

### 1. Navegacao por Cliques

```javascript
// Clicar em links em sequencia
const links = await find({ description: "menu item" });

for (const link of links.slice(0, 3)) { // primeiros 3
  await computer({ action: "left_click", ref: link.ref });
  await computer({ action: "wait", duration: 2 });
  await computer({ action: "screenshot" });
  await navigate({ url: "back" });
  await computer({ action: "wait", duration: 1 });
}
```

### 2. Preencher Formulario Simples

```javascript
// Input de texto
const emailInput = await find({ description: "email input" });
await computer({ action: "left_click", ref: emailInput[0].ref });
await computer({ action: "type", text: "teste@email.com" });

// Input de senha
const senhaInput = await find({ description: "password input" });
await computer({ action: "left_click", ref: senhaInput[0].ref });
await computer({ action: "type", text: "minhasenha123" });

// Submit
const submitBtn = await find({ description: "submit button" });
await computer({ action: "left_click", ref: submitBtn[0].ref });
```

### 3. Scroll e Captura

```javascript
// Scroll ate o final da pagina capturando screenshots
for (let i = 0; i < 5; i++) {
  await computer({ action: "screenshot" });
  await computer({
    action: "scroll",
    coordinate: [800, 400],
    scroll_direction: "down",
    scroll_amount: 3
  });
  await computer({ action: "wait", duration: 1 });
}
```

---

## O Que NAO Funciona Bem

| Elemento | Problema | Alternativa |
|----------|----------|-------------|
| Radio buttons | Clique nao registra | javascript_tool |
| Checkboxes | Clique nao registra | javascript_tool |
| Dropdowns | Selecao nao persiste | javascript_tool |
| Formularios complexos | Dados nao persistem | Playwright/Selenium |
| Captchas | Bloqueado | Manual |

---

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Clique nao funciona | Elemento coberto | Scroll ate elemento |
| Input nao aceita texto | Foco perdido | Clicar antes de digitar |
| Formulario nao envia | Validacao JS | Usar javascript_tool |
| Acao nao registra | Timing | Aumentar wait |
