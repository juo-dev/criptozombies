# ZombieFactory Examples

Esta pasta contém exemplos práticos de como usar o ZombieFactory refatorado com Viem.

## 📁 Arquivos (3 arquivos como originalmente)

### `basic-usage.ts`

**Para iniciantes** - Exemplo básico (baseado no antigo `example-usage.ts`)

- ✅ Função `initializeApp()` - configuração inicial
- ✅ Criação de zombies
- ✅ Leitura de dados
- ✅ Setup da UI

### `event-listening.ts`

**Para eventos em tempo real** (baseado no antigo `event-listener-demo.ts`)

- 🎧 `demonstrateEventListening()` - Listener de produção
- 🧪 `testEventListening()` - Teste completo de eventos
- 📊 Funções adicionais de dashboard

### `advanced-patterns.ts`

**Padrões avançados** - Consolidado com conteúdo do antigo `usage-examples.ts`

- 🏗️ Classe ZombieApp completa (novo)
- ⚛️ Hook para React (novo)
- 🟢 Composable para Vue (novo)
- 🛡️ Tratamento de erros (novo)
- 🏭 `productionApp()` - do arquivo original
- 🔬 `developmentTest()` - do arquivo original
- 🎯 `zombieDashboard()` - do arquivo original
- 🐛 `debugEvents()` - do arquivo original

## ✅ Validação dos Códigos

Voltamos aos 3 arquivos originais com todo o código preservado:

| Arquivo Original         | Arquivo Novo           | Status                               |
| ------------------------ | ---------------------- | ------------------------------------ |
| `example-usage.ts`       | `basic-usage.ts`       | ✅ Código preservado                 |
| `event-listener-demo.ts` | `event-listening.ts`   | ✅ Funções principais preservadas    |
| `usage-examples.ts`      | `advanced-patterns.ts` | ✅ Código preservado + conteúdo novo |

## 🚀 Como Usar

```typescript
// Exemplo básico
import { initializeApp } from './examples/basic-usage'
await initializeApp()

// Eventos em tempo real
import {
  demonstrateEventListening,
  testEventListening,
} from './examples/event-listening'
const cleanup = demonstrateEventListening()
await testEventListening()

// Padrões avançados + cenários de produção
import {
  ZombieApp,
  productionApp,
  developmentTest,
} from './examples/advanced-patterns'
const app = new ZombieApp(CONTRACT_ADDRESS)
const cleanup = productionApp()
await developmentTest()
```
