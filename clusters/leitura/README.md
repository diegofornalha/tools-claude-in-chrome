# Cluster: Leitura

Ferramentas para extrair informacoes de paginas web.

## Ferramentas

| Ferramenta | Funcao | Taxa Sucesso |
|------------|--------|--------------|
| `read_page` | Ler arvore DOM estruturada | 98% |
| `get_page_text` | Extrair texto limpo | 98% |
| `find` | Buscar elementos por linguagem natural | 90% |

## read_page

Le a estrutura DOM da pagina atual.

```javascript
// Ler tudo
const page = await read_page();

// Filtrar apenas elementos interativos
const interativos = await read_page({ filter: "interactive" });
```

**Retorna:**
- Arvore DOM com refs (referencias para clicar)
- Texto dos elementos
- Atributos relevantes

**Quando usar:**
- Entender estrutura da pagina
- Encontrar refs para cliques
- Debug de elementos nao encontrados

---

## get_page_text

Extrai apenas o texto visivel da pagina.

```javascript
const texto = await get_page_text();
// Retorna: "Titulo da Pagina\n\nParagrafo 1...\n\nParagrafo 2..."
```

**Quando usar:**
- Scraping de conteudo textual
- Analise de texto sem HTML
- Resumo de paginas

---

## find

Busca elementos usando linguagem natural.

```javascript
// Encontrar botao de login
const botoes = await find({ description: "login button" });

// Encontrar campo de email
const campos = await find({ description: "email input" });

// Resultado:
[
  { ref: "ref_5", text: "Login", type: "button" },
  ...
]
```

**Dicas:**
- Use descricoes genericas: "button" em vez de "clique aqui para enviar"
- Se nao encontrar, tente read_page() para ver estrutura
- O ref retornado pode ser usado em computer(left_click)

---

## Workflow de Extracao

```javascript
// 1. Navegar
await navigate({ url: "https://exemplo.com/produtos" });
await computer({ action: "wait", duration: 2 });

// 2. Ler estrutura
const page = await read_page();
console.log("Estrutura:", page);

// 3. Extrair texto limpo
const texto = await get_page_text();
console.log("Conteudo:", texto);

// 4. Encontrar elemento especifico
const botaoComprar = await find({ description: "buy button" });
if (botaoComprar.length > 0) {
  console.log("Encontrado:", botaoComprar[0]);
}
```

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| read_page vazio | Pagina carregando | Aumentar wait |
| find retorna 0 | Descricao muito especifica | Usar termo generico |
| Texto truncado | Pagina muito grande | Usar JavaScript para query especifica |
