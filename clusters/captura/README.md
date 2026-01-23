# Cluster: Captura

Ferramentas para captura visual (screenshots e GIFs).

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `computer(screenshot)` | Capturar tela | 95% |
| `gif_creator` | Gravar sequencia de acoes | 95% |
| `resize_window` | Ajustar tamanho da janela | 95% |

## computer(screenshot)

Captura screenshot da aba atual.

```javascript
// Capturar tela
const screenshot = await computer({ action: "screenshot" });

// O screenshot eh retornado como imagem que pode ser analisada
```

**Dicas:**
- Aguardar pagina carregar antes de capturar
- Usar resize_window para viewport especifico
- Util para debug visual e documentacao

---

## gif_creator

Grava sequencia de acoes em GIF animado.

```javascript
// Iniciar gravacao
await gif_creator({
  action: "start",
  filename: "meu_fluxo.gif"
});

// Executar acoes
await navigate({ url: "https://exemplo.com" });
await computer({ action: "wait", duration: 1 });
await computer({ action: "screenshot" }); // frame

await computer({ action: "left_click", ref: "ref_5" });
await computer({ action: "wait", duration: 1 });
await computer({ action: "screenshot" }); // frame

// Finalizar gravacao
await gif_creator({ action: "stop" });
// GIF salvo em: meu_fluxo.gif
```

**Parametros:**
- `action`: "start" ou "stop"
- `filename`: nome do arquivo (apenas no start)

**Dicas:**
- Capturar frames ANTES e DEPOIS de cada acao
- Usar nomes descritivos: "login_flow.gif", "checkout_process.gif"
- Bom para documentacao e compartilhamento

---

## resize_window

Ajusta tamanho da janela do navegador.

```javascript
// Desktop padrao
await resize_window({ width: 1920, height: 1080 });

// Tablet
await resize_window({ width: 768, height: 1024 });

// Mobile
await resize_window({ width: 375, height: 812 });
```

**Presets comuns:**
| Dispositivo | Width | Height |
|-------------|-------|--------|
| Desktop HD | 1920 | 1080 |
| Desktop | 1366 | 768 |
| Tablet | 768 | 1024 |
| Mobile | 375 | 812 |

---

## Workflows

### 1. Documentar Fluxo Completo

```javascript
// Iniciar gravacao
await gif_creator({ action: "start", filename: "tutorial_login.gif" });

// Passo 1: Pagina inicial
await navigate({ url: "https://app.exemplo.com" });
await computer({ action: "wait", duration: 2 });
await computer({ action: "screenshot" });

// Passo 2: Clicar em login
const loginBtn = await find({ description: "login button" });
await computer({ action: "left_click", ref: loginBtn[0].ref });
await computer({ action: "wait", duration: 2 });
await computer({ action: "screenshot" });

// Passo 3: Formulario
await computer({ action: "screenshot" });

// Finalizar
await gif_creator({ action: "stop" });
console.log("GIF salvo: tutorial_login.gif");
```

### 2. Teste Visual Responsivo

```javascript
const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 }
];

for (const vp of viewports) {
  await resize_window({ width: vp.width, height: vp.height });
  await computer({ action: "wait", duration: 1 });

  const screenshot = await computer({ action: "screenshot" });
  console.log(`Capturado: ${vp.name}`);
}
```

### 3. Comparacao Visual

```javascript
// Capturar estado inicial
await navigate({ url: "https://exemplo.com" });
await computer({ action: "wait", duration: 2 });
const antes = await computer({ action: "screenshot" });

// Executar acao
await computer({ action: "left_click", ref: "ref_toggle" });
await computer({ action: "wait", duration: 1 });

// Capturar estado final
const depois = await computer({ action: "screenshot" });

// Analisar diferenca visual (manual ou via AI)
console.log("Screenshots capturados para comparacao");
```

---

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Screenshot preto/vazio | Pagina carregando | Aumentar wait duration |
| GIF sem frames | Nao capturou screenshots | Adicionar screenshot entre acoes |
| Viewport nao muda | Janela maximizada | Restaurar janela antes |
| Imagem cortada | Viewport muito pequeno | Aumentar dimensoes |
