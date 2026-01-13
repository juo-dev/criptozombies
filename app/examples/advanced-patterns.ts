// Advanced usage patterns and real-world scenarios

import { ZombieFactory, generateZombie } from '../src/zombieFactory'
import {
  demonstrateEventListening,
  testEventListening,
} from './event-listening'

/**
 * Production app example - shows how to structure a real application
 */
export class ZombieApp {
  private zombieFactory: ZombieFactory
  private eventCleanup: (() => void) | null = null
  private zombies: Map<string, any> = new Map()

  constructor(contractAddress: `0x${string}`) {
    this.zombieFactory = new ZombieFactory(contractAddress)
  }

  /**
   * Initialize the app - call this when your app starts
   */
  async initialize() {
    console.log('🚀 Initializing Zombie App...')

    // Start listening for events
    this.startEventListening()

    // Load existing zombies (if you have a way to get them)
    await this.loadExistingZombies()

    console.log('✅ Zombie App initialized')
  }

  /**
   * Create a new zombie with error handling and user feedback
   */
  async createZombie(name: string): Promise<boolean> {
    if (!name.trim()) {
      this.showError('Please enter a zombie name')
      return false
    }

    if (name.length > 32) {
      this.showError('Zombie name too long (max 32 characters)')
      return false
    }

    try {
      this.showLoading('Creating zombie...')

      const txHash = await this.zombieFactory.createRandomZombie(name)

      this.showSuccess(`Zombie creation started! Transaction: ${txHash}`)
      console.log('🧟 Zombie creation transaction:', txHash)

      return true
    } catch (error: any) {
      console.error('❌ Failed to create zombie:', error)

      // Handle specific error types
      if (error.message.includes('User rejected')) {
        this.showError('Transaction was cancelled')
      } else if (error.message.includes('insufficient funds')) {
        this.showError('Insufficient funds for transaction')
      } else {
        this.showError('Failed to create zombie. Please try again.')
      }

      return false
    } finally {
      this.hideLoading()
    }
  }

  /**
   * Get zombie details with caching
   */
  async getZombie(zombieId: bigint): Promise<any | null> {
    const id = zombieId.toString()

    // Check cache first
    if (this.zombies.has(id)) {
      return this.zombies.get(id)
    }

    try {
      const zombie = await this.zombieFactory.getZombie(zombieId)
      const visualDetails = generateZombie(zombieId, zombie.name, zombie.dna)

      const fullZombie = {
        id: zombieId,
        name: zombie.name,
        dna: zombie.dna,
        visual: visualDetails,
        loadedAt: new Date(),
      }

      // Cache the result
      this.zombies.set(id, fullZombie)

      return fullZombie
    } catch (error) {
      console.error(`❌ Failed to get zombie ${id}:`, error)
      return null
    }
  }

  /**
   * Start listening for zombie creation events
   */
  private startEventListening() {
    this.eventCleanup = this.zombieFactory.watchNewZombieEvents((event) => {
      console.log('🎉 New zombie detected:', event)

      // Generate visual details
      const visualDetails = generateZombie(
        event.zombieId,
        event.name,
        event.dna
      )

      const zombie = {
        id: event.zombieId,
        name: event.name,
        dna: event.dna,
        visual: visualDetails,
        createdAt: new Date(),
      }

      // Add to cache
      this.zombies.set(event.zombieId.toString(), zombie)

      // Update UI
      this.onNewZombie(zombie)
    })
  }

  /**
   * Load existing zombies (you'd implement this based on your needs)
   */
  private async loadExistingZombies() {
    // This is just an example - you'd implement based on your data source
    console.log('📖 Loading existing zombies...')

    // Example: Load first 10 zombies
    for (let i = 0; i < 10; i++) {
      try {
        const zombie = await this.getZombie(BigInt(i))
        if (zombie) {
          console.log(`✅ Loaded zombie ${i}:`, zombie.name)
        }
      } catch (error) {
        // Zombie doesn't exist, stop loading
        break
      }
    }
  }

  /**
   * Clean up resources - call this when your app shuts down
   */
  destroy() {
    if (this.eventCleanup) {
      this.eventCleanup()
      this.eventCleanup = null
    }

    this.zombies.clear()
    console.log('🧹 Zombie App cleaned up')
  }

  /**
   * Get all cached zombies
   */
  getAllZombies(): any[] {
    return Array.from(this.zombies.values())
  }

  /**
   * Search zombies by name
   */
  searchZombies(query: string): any[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllZombies().filter((zombie) =>
      zombie.name.toLowerCase().includes(lowerQuery)
    )
  }

  // UI feedback methods (implement based on your UI framework)
  private showLoading(message: string) {
    console.log('⏳', message)
    // Implement loading UI
  }

  private hideLoading() {
    console.log('✅ Loading complete')
    // Hide loading UI
  }

  private showSuccess(message: string) {
    console.log('✅', message)
    // Show success notification
  }

  private showError(message: string) {
    console.error('❌', message)
    // Show error notification
  }

  private onNewZombie(zombie: any) {
    console.log('🆕 New zombie added to app:', zombie)
    // Update your UI with the new zombie
  }
}

/**
 * React Hook example (if you're using React)
 */
export function useZombieFactory(contractAddress: `0x${string}`) {
  // This would be implemented as a proper React hook
  // Just showing the pattern here

  const zombieApp = new ZombieApp(contractAddress)

  // In real React hook, you'd use useEffect for cleanup
  // useEffect(() => {
  //   zombieApp.initialize()
  //   return () => zombieApp.destroy()
  // }, [])

  return {
    createZombie: (name: string) => zombieApp.createZombie(name),
    getZombie: (id: bigint) => zombieApp.getZombie(id),
    getAllZombies: () => zombieApp.getAllZombies(),
    searchZombies: (query: string) => zombieApp.searchZombies(query),
  }
}

/**
 * Vue Composable example (if you're using Vue)
 */
export function useZombieFactoryVue(contractAddress: `0x${string}`) {
  const zombieApp = new ZombieApp(contractAddress)

  // In real Vue composable, you'd use onMounted/onUnmounted
  // onMounted(() => zombieApp.initialize())
  // onUnmounted(() => zombieApp.destroy())

  return {
    createZombie: (name: string) => zombieApp.createZombie(name),
    getZombie: (id: bigint) => zombieApp.getZombie(id),
    getAllZombies: () => zombieApp.getAllZombies(),
    searchZombies: (query: string) => zombieApp.searchZombies(query),
  }
}

/**
 * Error handling patterns
 */
export class ZombieErrorHandler {
  static handleContractError(error: any): string {
    if (error.message.includes('User rejected')) {
      return 'Transaction was cancelled by user'
    }

    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for gas fees'
    }

    if (error.message.includes('execution reverted')) {
      return 'Transaction failed - contract rejected the operation'
    }

    if (error.message.includes('network')) {
      return 'Network error - please check your connection'
    }

    return 'An unexpected error occurred'
  }

  static isRetryableError(error: any): boolean {
    const retryableErrors = ['network', 'timeout', 'rate limit', 'temporary']

    return retryableErrors.some((keyword) =>
      error.message.toLowerCase().includes(keyword)
    )
  }
}

// =============================================================================
// Production scenarios from the original usage-examples.ts
// =============================================================================

// 🏭 PRODUÇÃO: App real que mostra zombies de todos os usuários
export function productionApp() {
  console.log('🚀 Iniciando app de produção...')

  // Escuta eventos de QUALQUER usuário que criar zombies
  const cleanup = demonstrateEventListening()

  // Em um app React seria:
  // useEffect(() => {
  //   const cleanup = demonstrateEventListening()
  //   return cleanup
  // }, [])

  return cleanup
}

// 🔬 DESENVOLVIMENTO: Testa se tudo funciona
export async function developmentTest() {
  console.log('🧪 Testando funcionalidade...')

  // Cria um zombie E verifica se o evento chega
  await testEventListening()

  console.log('✅ Teste concluído!')
}

// 🎯 CENÁRIO REAL: Dashboard que mostra atividade
export function zombieDashboard() {
  console.log('📊 Iniciando dashboard...')

  let zombieCount = 0

  const cleanup = demonstrateEventListening()

  // Sobrescreve o callback para contar zombies
  // (isso é só um exemplo, na prática você passaria o callback)

  // Simula atualização de estatísticas
  setInterval(() => {
    console.log(`📈 Total de zombies criados: ${zombieCount}`)
  }, 10000)

  return cleanup
}

// 🐛 DEBUG: Quando algo não funciona
export async function debugEvents() {
  console.log('🐛 Debugando eventos...')

  // Primeiro testa se consegue escutar
  console.log('Teste 1: Criando e escutando evento...')
  await testEventListening()

  // Depois deixa escutando para ver se outros eventos chegam
  console.log('Teste 2: Escutando eventos externos...')
  const cleanup = demonstrateEventListening()

  // Para após 1 minuto
  setTimeout(() => {
    console.log('🔚 Parando debug...')
    cleanup()
  }, 60000)
}
