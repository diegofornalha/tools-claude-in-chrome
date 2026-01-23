# Cluster: Navegacao

Ferramentas para controle de abas e navegacao entre paginas.

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `tabs_context_mcp` | Obter contexto de abas abertas | 98% |
| `tabs_create_mcp` | Criar nova aba | 98% |
| `navigate` | Navegar para URL, back, forward | 95% |

## tabs_context_mcp

Obtem informacoes sobre as abas disponiveis no grupo atual.

```javascript
// Sempre comecar sessao com isso
const tabs = await tabs_context_mcp({ createIfEmpty: true });

// Retorna:
{
  availableTabs: [
    { tabId: 123456, title: "Google", url: "https://google.com" }
  ],
  tabGroupId: 789
}
```

**Quando usar:**
- Inicio de qualquer sessao de automacao
- Apos erros de "tab not found"
- Para verificar abas disponiveis

---

## tabs_create_mcp

Cria uma nova aba no grupo atual.

```javascript
const novaTab = await tabs_create_mcp();
// Retorna nova aba com ID unico
```

**Quando usar:**
- Quando precisa de aba limpa
- Para abrir multiplas paginas em paralelo

---

## navigate

Navega para uma URL ou controla historico.

```javascript
// Navegar para URL
await navigate({ url: "https://exemplo.com" });

// Voltar
await navigate({ url: "back" });

// Avancar
await navigate({ url: "forward" });
```

**Parametros:**
- `url`: URL completa ou "back"/"forward"

**Dicas:**
- Sempre aguardar apos navegacao: `await computer({ action: "wait", duration: 2 })`
- URLs devem incluir protocolo (https://)

---

## Workflow Tipico

```javascript
// 1. Obter/criar contexto
const tabs = await tabs_context_mcp({ createIfEmpty: true });

// 2. Navegar
await navigate({ url: "https://google.com" });

// 3. Aguardar carregamento
await computer({ action: "wait", duration: 2 });

// 4. Verificar se carregou
const title = await javascript_tool({ code: "return document.title" });
console.log("Pagina:", title);
```

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| "Tab doesn't exist" | ID expirado | Chamar tabs_context_mcp() novamente |
| Pagina nao carrega | Timeout | Aumentar wait duration |
| URL invalida | Falta protocolo | Adicionar https:// |
