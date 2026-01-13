# Migração de Web3.js para Viem

## Resumo das Mudanças

O arquivo `zombieFactory.ts` foi completamente refatorado para usar **Viem** ao invés de **Web3.js**, oferecendo melhor performance, type safety e uma API mais moderna.

## Estrutura de Arquivos

```
app/
├── src/
│   ├── contracts/
│   │   └── ZombieFactory.abi.ts    # ABI extraída para uso com Viem
│   └── zombieFactory.ts            # Implementação principal refatorada
├── examples/
│   ├── README.md                   # Guia dos exemplos
│   ├── basic-usage.ts              # Exemplo básico para iniciantes
│   ├── event-listening.ts          # Exemplos de eventos em tempo real
│   └── advanced-patterns.ts        # Padrões avançados e estruturas de produção
├── scripts/
│   └── sync-abi.js                 # Script de sincronização da ABI
└── package.json                    # Com script sync-abi
```

**Importante**: A ABI está agora isolada dentro do projeto `app`, eliminando dependências cruzadas com o projeto `web3`. Isso permite que ambos os projetos sejam deployados independentemente.

## Principais Melhorias

### 1. **Type Safety Completa**

- Todos os tipos são inferidos automaticamente
- Suporte completo ao TypeScript
- Eliminação de erros de runtime relacionados a tipos

### 2. **API Moderna e Limpa**

- Uso de async/await ao invés de callbacks
- Melhor tratamento de erros
- Código mais legível e maintível

### 3. **Performance Otimizada**

- Viem é mais leve que Web3.js
- Melhor gerenciamento de conexões
- Suporte nativo a tree-shaking

## Comparação: Antes vs Depois

### Antes (Web3.js)

```javascript
// Configuração do contrato
var ZombieFactoryContract = web3.eth.contract(abi)
var ZombieFactory = ZombieFactoryContract.at(contractAddress)

// Chamada de função
ZombieFactory.createRandomZombie(name)

// Event listener
var event = ZombieFactory.NewZombie(function (error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})
```

### Depois (Viem)

```typescript
// Configuração do contrato
const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

// Chamada de função (com tratamento de erro)
try {
  const txHash = await zombieFactory.createRandomZombie(name)
  console.log('Transaction sent:', txHash)
} catch (error) {
  console.error('Failed to create zombie:', error)
}

// Event listener
const unwatch = zombieFactory.watchNewZombieEvents((event) => {
  generateZombie(event.zombieId, event.name, event.dna)
})
```

## Funcionalidades Implementadas

### 1. **Classe ZombieFactory**

- `createRandomZombie(name: string)`: Cria um novo zombie
- `getZombie(zombieId: bigint)`: Busca dados de um zombie
- `watchNewZombieEvents(callback)`: Escuta eventos NewZombie

### 2. **Funções Utilitárias**

- `setupZombieFactoryUI()`: Configura event listeners da UI
- `generateZombie()`: Gera detalhes visuais do zombie a partir do DNA

### 3. **Types Definidos**

```typescript
interface ZombieDetails {
  headChoice: number
  eyeChoice: number
  shirtChoice: number
  skinColorChoice: number
  eyeColorChoice: number
  clothesColorChoice: number
  zombieName: string
  zombieDescription: string
}
```

## Como Usar

Consulte os exemplos na pasta `examples/` para diferentes casos de uso:

### 1. **Uso Básico** (`examples/basic-usage.ts`)

```typescript
import { basicZombieFactoryExample } from './examples/basic-usage'

// Inicialização simples
const cleanup = await basicZombieFactoryExample()
```

### 2. **Eventos em Tempo Real** (`examples/event-listening.ts`)

```typescript
import { startEventListener } from './examples/event-listening'

// Escuta eventos de todos os usuários
const cleanup = startEventListener()
```

### 3. **Aplicação Avançada** (`examples/advanced-patterns.ts`)

```typescript
import { ZombieApp } from './examples/advanced-patterns'

// App completo com cache, error handling, etc.
const app = new ZombieApp(CONTRACT_ADDRESS)
await app.initialize()
```

## Configuração Necessária

### 1. **Atualizar CONTRACT_ADDRESS**

No arquivo `zombieFactory.ts`, linha 30:

```typescript
const CONTRACT_ADDRESS = '0x...' // Substitua pelo endereço real do contrato
```

### 2. **Configurar Chain**

Se não estiver usando Mainnet, atualize a linha 31:

```typescript
const CHAIN = mainnet // Substitua pela chain desejada (ex: sepolia, polygon, etc.)
```

### 3. **HTML Structure**

Certifique-se que sua UI tenha os elementos:

```html
<input id="nameInput" type="text" placeholder="Enter zombie name" />
<button id="ourButton">Create Zombie</button>
```

## Benefícios da Migração

1. **Melhor Developer Experience**: IntelliSense completo e detecção de erros em tempo de desenvolvimento
2. **Código Mais Robusto**: Tratamento adequado de erros e tipos seguros
3. **Performance**: Viem é mais rápido e consome menos recursos
4. **Manutenibilidade**: Código mais organizado e fácil de entender
5. **Futuro-Proof**: Viem é ativamente mantido e segue as melhores práticas modernas

## Próximos Passos

1. Testar a integração com sua UI existente
2. Atualizar o endereço do contrato após deploy
3. Configurar a chain correta para seu ambiente
4. Implementar tratamento de erros específico para sua aplicação
5. Adicionar loading states e feedback visual para melhor UX

## Sincronização da ABI

### Mantendo a ABI Atualizada

Como os projetos `app` e `web3` são independentes, você precisa manter a ABI sincronizada manualmente quando o contrato for modificado.

**Processo recomendado:**

1. **Após modificar o contrato** no projeto `web3`, compile-o:

   ```bash
   cd web3
   npx hardhat compile
   ```

2. **Execute o script de sincronização** no projeto `app`:

   ```bash
   cd app
   npm run sync-abi
   ```

O script automaticamente:

- Lê o artifact de `web3/artifacts/contracts/ZombieFactory.sol/ZombieFactory.json`
- Extrai apenas a ABI necessária
- Atualiza `app/src/contracts/ZombieFactory.abi.ts`

### Script de Sincronização

O projeto já inclui um script automatizado para sincronizar a ABI:

```bash
# No diretório app/
npm run sync-abi
```

O script `scripts/sync-abi.js`:

- Verifica se o artifact existe no projeto web3
- Extrai apenas a ABI necessária
- Gera o arquivo TypeScript com tipos corretos
- Fornece feedback sobre funções e eventos encontrados

### Versionamento

Considere versionar a ABI junto com o endereço do contrato para evitar incompatibilidades:

```typescript
// app/src/contracts/config.ts
export const CONTRACT_CONFIG = {
  address: '0x...' as `0x${string}`,
  version: '1.0.0',
  deployedAt: '2024-01-01',
  network: 'mainnet',
}
```
