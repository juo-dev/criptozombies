import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseAbiItem,
} from 'viem'
import { mainnet } from 'viem/chains'
import { ZombieFactoryAbi } from './contracts/ZombieFactory.abi'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// Types
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

interface NewZombieEvent {
  zombieId: bigint
  name: string
  dna: bigint
}

// Configuration
const CONTRACT_ADDRESS = '0x...' // Replace with your deployed contract address
const CHAIN = mainnet // Replace with your target chain

// Create clients
const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: CHAIN,
  transport: custom(window.ethereum),
})

// ZombieFactory class for better organization
export class ZombieFactory {
  private contractAddress: `0x${string}`

  constructor(contractAddress: `0x${string}`) {
    this.contractAddress = contractAddress
  }

  // Create a random zombie
  async createRandomZombie(name: string): Promise<`0x${string}`> {
    try {
      const [account] = await walletClient.requestAddresses()

      const { request } = await publicClient.simulateContract({
        address: this.contractAddress,
        abi: ZombieFactoryAbi,
        functionName: 'createRandomZombie',
        args: [name],
        account,
      })

      const hash = await walletClient.writeContract(request)
      return hash
    } catch (error) {
      console.error('Error creating zombie:', error)
      throw error
    }
  }

  // Get zombie details by ID
  async getZombie(zombieId: bigint): Promise<{ name: string; dna: bigint }> {
    try {
      const result = await publicClient.readContract({
        address: this.contractAddress,
        abi: ZombieFactoryAbi,
        functionName: 'zombies',
        args: [zombieId],
      })

      return {
        name: result[0],
        dna: result[1],
      }
    } catch (error) {
      console.error('Error getting zombie:', error)
      throw error
    }
  }

  // Listen for NewZombie events
  watchNewZombieEvents(callback: (event: NewZombieEvent) => void) {
    return publicClient.watchContractEvent({
      address: this.contractAddress,
      abi: ZombieFactoryAbi,
      eventName: 'NewZombie',
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.args) {
            callback({
              zombieId: log.args.zombieId!,
              name: log.args.name!,
              dna: log.args.dna!,
            })
          }
        })
      },
    })
  }
}

// Initialize ZombieFactory instance
const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

// UI Event handlers (assuming you're using vanilla JS or jQuery)
export function setupZombieFactoryUI() {
  // Event listener for creating zombies
  const createButton = document.getElementById('ourButton')
  const nameInput = document.getElementById('nameInput') as HTMLInputElement

  if (createButton && nameInput) {
    createButton.addEventListener('click', async () => {
      const name = nameInput.value.trim()
      if (!name) {
        alert('Please enter a zombie name')
        return
      }

      try {
        const txHash = await zombieFactory.createRandomZombie(name)
        console.log('Transaction sent:', txHash)
        // You can add UI feedback here
      } catch (error) {
        console.error('Failed to create zombie:', error)
        // Handle error in UI
      }
    })
  }

  // Listen for NewZombie events and update UI
  const unwatch = zombieFactory.watchNewZombieEvents((event) => {
    generateZombie(event.zombieId, event.name, event.dna)
  })

  // Return cleanup function
  return () => {
    unwatch()
  }
}

// Generate zombie visual details from DNA
export function generateZombie(
  id: bigint,
  name: string,
  dna: bigint
): ZombieDetails {
  const dnaStr = dna.toString().padStart(16, '0')

  const zombieDetails: ZombieDetails = {
    // first 2 digits make up the head. We have 7 possible heads, so % 7
    // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
    // image files named "head1.png" through "head7.png" we load based on
    // this number:
    headChoice: (parseInt(dnaStr.substring(0, 2)) % 7) + 1,
    // 2nd 2 digits make up the eyes, 11 variations:
    eyeChoice: (parseInt(dnaStr.substring(2, 4)) % 11) + 1,
    // 6 variations of shirts:
    shirtChoice: (parseInt(dnaStr.substring(4, 6)) % 6) + 1,
    // last 6 digits control color. Updated using CSS filter: hue-rotate
    // which has 360 degrees:
    skinColorChoice: Math.floor((parseInt(dnaStr.substring(6, 8)) / 100) * 360),
    eyeColorChoice: Math.floor((parseInt(dnaStr.substring(8, 10)) / 100) * 360),
    clothesColorChoice: Math.floor(
      (parseInt(dnaStr.substring(10, 12)) / 100) * 360
    ),
    zombieName: name,
    zombieDescription: 'A Level 1 CryptoZombie',
  }

  // Here you would update your UI with the zombie details
  console.log('Generated zombie:', zombieDetails)

  return zombieDetails
}
