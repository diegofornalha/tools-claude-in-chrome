# Claude in Chrome MCP - Guia Prático

Documentação sobre capacidades, limitações e melhores práticas para uso do Claude in Chrome MCP (Model Context Protocol) na automação de navegadores.

## 📊 Status das Funcionalidades

### ✅ Funciona Bem (Confiável)

- **Navegação**: `navigate()` - mudança de URLs, forward/back
- **Screenshots**: `computer(screenshot)` - captura visual da tela
- **Leitura de página**: `read_page()` - extração da árvore DOM
- **Busca de elementos**: `find()` com natural language ("botão login", "campo email")
- **JavaScript execution**: `javascript_tool()` - executar código na página (queries, extração)
- **Cliques simples**: `computer(left_click)` - cliques em elementos únicos e visíveis
- **Navegação por links**: Cliques em `<a>` tags
- **Extração de texto**: `get_page_text()` - obter texto limpo da página
- **Leitura de console**: `read_console_messages()` - acessar console logs
- **Leitura de network**: `read_network_requests()` - monitorar requisições HTTP

### ⚠️ Funciona Parcialmente (Use com Cuidado)

- **form_input()**: Preenchimento de inputs textuais - às vezes não persiste
- **Múltiplos cliques em sequência**: Pode não registrar todas as ações
- **Esperas implícitas**: Timing issues, às vezes página não carrega a tempo
- **Hover/eventos complexos**: Interações hover funcionam mas eventos podem não disparar

### ❌ Não Funciona Bem (Evitar)

- **Radio buttons/checkboxes**: Cliques não são registrados no formulário
- **Seleção de opções (dropdowns)**: Pode falhar em registrar a seleção
- **Automação de formulários complexos**: Múltiplos campos em sequência
- **Preenchimento confiável de forms**: Dados não persistem depois do clique
- **Simulação de comportamento real de usuário**: JavaScript de validação pode não funcionar
- **Sequências longas de ações**: Erros acumulam em múltiplos passos
- **DOM manipulation com side effects**: Eventos que requerem processamento backend podem falhar

## 🎯 Guia de Uso

### Para Leitura/Extração (RECOMENDADO)

```javascript
// 1. Navegar
await navigate(url);

// 2. Capturar visual
const screenshot = await computer(screenshot);

// 3. Extrair elementos
const elements = await find("login button");

// 4. Ler página
const pageContent = await read_page();

// 5. Executar query com JavaScript
const result = await javascript_tool("return document.title");
```

**Resultado esperado**: 95%+ de sucesso ✅

### Para Cliques Simples (ACEITÁVEL)

```javascript
// Clique único em elemento bem definido
await computer(left_click, ref="ref_5");

// Clique em coordenadas visíveis
await computer(left_click, coordinate=[100, 200]);
```

**Resultado esperado**: 80-90% de sucesso

### Para Preenchimento de Formulários (⚠️ EVITAR)

```javascript
// ❌ NÃO FAÇA ISSO
await find("radio option C");
await computer(left_click, ref="ref_22"); // Pode não registrar

// ❌ NÃO FAÇA ISSO
await form_input(ref="input_id", value="dados");
await computer(left_click, ref="submit_btn"); // Pode não persistir
```

**Resultado esperado**: 0-50% de sucesso (NÃO CONFIÁVEL)

## 📋 Casos de Uso Recomendados

### ✅ Ideal Para

- Scraping de dados de websites
- Verificação visual de páginas (screenshots)
- Extração de informações dinâmicas
- Testes de UI simples (verificar se elemento existe)
- Monitoramento de mudanças em páginas
- Leitura de conteúdo atualizado dinamicamente
- Navegação e coleta de links
- Análise de estrutura DOM

### ❌ NÃO Use Para

- Automação de testes de formulários
- Submissão de dados críticos
- Preenchimento de múltiplos campos em sequência
- Simulação de fluxo de usuário completo
- Qualquer coisa que requeira garantia de execução

## 🔧 Troubleshooting

### Problema: "Tab doesn't exist" ou "MCP error"

**Solução**:
```javascript
// Sempre começar com tabs_context_mcp
const tabs = await tabs_context_mcp();
const tabId = tabs.availableTabs[0].tabId;
```

### Problema: Cliques não são registrados

**Causa**: Radio buttons, checkboxes, inputs especiais exigem processamento JavaScript especial

**Solução alternativa**:
```javascript
// Tentar JavaScript direto
await javascript_tool(`
  document.querySelector('input[value="C"]').click();
  document.querySelector('input[value="C"]').dispatchEvent(new Event('change', { bubbles: true }));
`);
```

### Problema: Formulário não persiste dados

**Causa**: O formulário valida/processa no backend e a MCP não aguarda

**Solução**: Use `read_network_requests()` para verificar se a requisição foi enviada

### Problema: Screenshot vem vazio ou cortado

**Causa**: Página ainda carregando

**Solução**:
```javascript
await computer(wait, duration=2); // Espere antes do screenshot
```

### Problema: find() não encontra elemento

**Causa**: Elemento pode estar fora da viewport ou texto é muito específico

**Solução**:
```javascript
// Tentar descrição mais genérica
await find("button");  // em vez de "Enviar formulário AGORA clique aqui"

// Ou usar read_page para encontrar ref_id
const page = await read_page(filter="interactive");
```

## 📈 Workflow Recomendado

```
1. Navegar para URL
2. Aguardar 1-2s se página tem muito JavaScript
3. Capturar screenshot para verificar visual
4. Usar read_page() para entender estrutura
5. Usar find() ou JavaScript para localizar elementos
6. Para ler dados: read_page() ou javascript_tool()
7. Para clicar simples: computer(left_click)
8. NÃO USE para: formulários complexos, múltiplos campos
```

## 🧪 Teste Realizado: DETRAN Simulado

### Contexto
Tentativa de automatizar simulado de prova teórica com 30 questões (radio buttons).

### O que funcionou:
- ✅ Navegação para o site
- ✅ Coleta visual de respostas corretas (identificar texto em verde)
- ✅ Screenshots de cada questão
- ✅ Leitura de estrutura da página

### O que falhou:
- ❌ Cliques em radio buttons não registraram (0% de acertos)
- ❌ Mesmo após clicar, o formulário não reconhecia a seleção
- ❌ Múltiplas tentativas com find(), left_click(), form_input() - nenhuma funcionou

### Conclusão:
O Claude in Chrome MCP **não é adequado para automação de formulários** com validação backend. Para isso use Selenium, Playwright ou outras ferramentas especializadas.

## 🚀 Melhores Práticas

1. **Sempre comece com `tabs_context_mcp()`** para obter IDs válidos
2. **Use `read_page()` antes de tentar interagir** com a página
3. **Para dados complexos, prefira JavaScript** em vez de cliques
4. **Aguarde 1-2s após navegação** antes de interagir
5. **Se não der certo em 2 tentativas, provavelmente não vai funcionar**
6. **Use subagents para tarefas complexas** que envolvam múltiplos passos
7. **Documente o erro** quando algo não funcionar - pode ser limitação conhecida

## 📚 Referências

- Tipos de operações disponíveis: `computer`, `navigate`, `read_page`, `find`, `javascript_tool`, `form_input`, `upload_image`, etc.
- Sempre verificar output de erros - "AbortError" geralmente significa timeout ou problema de MCP
- Console messages podem ter dicas sobre o que deu errado

---

**Última atualização**: 2026-01-21
**Baseado em testes reais com**: Simulado DETRAN (http://simulado.detran.rj.gov.br)
