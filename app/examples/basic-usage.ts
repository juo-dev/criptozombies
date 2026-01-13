// Example usage of the refactored ZombieFactory with Viem

import {
  ZombieFactory,
  setupZombieFactoryUI,
  generateZombie,
} from '../src/zombieFactory'

// Example: Initialize and use ZombieFactory
export async function initializeApp() {
  // Replace with your actual deployed contract address
  const CONTRACT_ADDRESS =
    '0x1234567890123456789012345678901234567890' as `0x${string}`

  // Create ZombieFactory instance
  const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

  // Setup UI event listeners
  const cleanup = setupZombieFactoryUI()

  // Example: Create a zombie programmatically
  try {
    const txHash = await zombieFactory.createRandomZombie('MyAwesomeZombie')
    console.log('Zombie creation transaction:', txHash)
  } catch (error) {
    console.error('Failed to create zombie:', error)
  }

  // Example: Get zombie details
  try {
    const zombie = await zombieFactory.getZombie(BigInt(0))
    console.log('Zombie details:', zombie)

    // Generate visual details
    const visualDetails = generateZombie(BigInt(0), zombie.name, zombie.dna)
    console.log('Visual details:', visualDetails)
  } catch (error) {
    console.error('Failed to get zombie:', error)
  }

  // Cleanup when done (e.g., component unmount)
  // cleanup()
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp)
