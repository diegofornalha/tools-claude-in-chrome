# Cluster: Debug

Ferramentas para debug de aplicacoes web (console e network).

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `read_console_messages` | Ler logs do console | 90% |
| `read_network_requests` | Monitorar requisicoes HTTP | 90% |

## read_console_messages

Le mensagens do console do navegador (logs, erros, warnings).

```javascript
// Ler todas as mensagens
const logs = await read_console_messages();

// Filtrar por padrao (regex)
const erros = await read_console_messages({ pattern: "error|Error|404" });

// Apenas erros
const apenasErros = await read_console_messages({ onlyErrors: true });
```

**Retorna:**
```javascript
[
  { type: "log", message: "App iniciado", timestamp: "..." },
  { type: "error", message: "Failed to fetch /api/user", timestamp: "..." }
]
```

**Quando usar:**
- Debug de erros JavaScript
- Verificar logs de aplicacao
- Capturar mensagens de frameworks (React, Vue, etc)

---

## read_network_requests

Monitora requisicoes HTTP feitas pela pagina.

```javascript
// Ler todas as requisicoes
const requests = await read_network_requests();

// Filtrar por padrao de URL
const apiCalls = await read_network_requests({ urlPattern: "/api/" });

// Limpar historico antes de nova acao
await read_network_requests({ clear: true });
```

**Retorna:**
```javascript
[
  {
    method: "GET",
    url: "https://api.exemplo.com/users",
    status: 200,
    duration: 150,
    size: 1024
  },
  {
    method: "POST",
    url: "https://api.exemplo.com/login",
    status: 401,
    duration: 80
  }
]
```

**Quando usar:**
- Debug de chamadas de API
- Verificar se requisicoes foram feitas
- Analisar erros de backend (4xx, 5xx)

---

## Workflows de Debug

### 1. Debug Completo de Pagina

```javascript
// 1. Limpar historico
await read_network_requests({ clear: true });

// 2. Navegar/executar acao
await navigate({ url: "https://app.exemplo.com" });
await computer({ action: "wait", duration: 3 });

// 3. Capturar estado
const console = await read_console_messages();
const network = await read_network_requests();
const screenshot = await computer({ action: "screenshot" });

// 4. Analisar
console.log("=== CONSOLE ===");
console.forEach(msg => console.log(`[${msg.type}] ${msg.message}`));

console.log("=== NETWORK ===");
network.forEach(req => console.log(`${req.method} ${req.url} -> ${req.status}`));
```

### 2. Capturar Erro Especifico

```javascript
// Executar acao que causa erro
await javascript_tool({ code: "document.querySelector('.submit').click()" });
await computer({ action: "wait", duration: 2 });

// Buscar erro
const erros = await read_console_messages({ pattern: "error" });
if (erros.length > 0) {
  console.log("Erro encontrado:", erros[0].message);
}

// Verificar se API falhou
const apiErros = await read_network_requests({ urlPattern: "/api/" });
const falhas = apiErros.filter(r => r.status >= 400);
if (falhas.length > 0) {
  console.log("API falhou:", falhas[0]);
}
```

### 3. Monitorar API em Tempo Real

```javascript
// Limpar
await read_network_requests({ clear: true });

// Executar acao
await computer({ action: "left_click", ref: "ref_submit_btn" });

// Aguardar
await computer({ action: "wait", duration: 2 });

// Verificar resultado
const requests = await read_network_requests({ urlPattern: "/api/submit" });
if (requests.length > 0 && requests[0].status === 200) {
  console.log("Sucesso! Dados enviados.");
} else {
  console.log("Falha ou requisicao nao encontrada");
}
```

---

## Combinando com Outros Clusters

```javascript
// Debug completo: Visual + Console + Network
async function debugCompleto(url) {
  // Navegar
  await navigate({ url });
  await computer({ action: "wait", duration: 3 });

  // Capturar visual
  const screenshot = await computer({ action: "screenshot" });

  // Capturar logs
  const console = await read_console_messages();

  // Capturar requests
  const network = await read_network_requests();

  // Capturar estrutura
  const page = await read_page();

  return { screenshot, console, network, page };
}
```

---

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Console vazio | Logs ja limparam | Executar acao e ler imediatamente |
| Network vazio | Requisicoes antes da sessao | Usar clear: true antes |
| Pattern nao filtra | Regex incorreto | Testar regex em regexr.com |
| Muitos resultados | Sem filtro | Usar urlPattern ou pattern |
