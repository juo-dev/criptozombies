// Event listening examples - demonstrates real-time blockchain event handling

import { ZombieFactory } from '../src/zombieFactory'

/**
 * Production-ready event listener
 * Use this in real applications to react to zombie creation events
 */
export function demonstrateEventListening() {
  const CONTRACT_ADDRESS = '0x...' as `0x${string}`
  const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

  console.log('🎧 Starting event listener...')

  // Listen for NewZombie events from ANY user
  const unwatch = zombieFactory.watchNewZombieEvents((event) => {
    console.log('🎉 New zombie created in real-time!')
    console.log('📊 Event data:', {
      zombieId: event.zombieId.toString(),
      name: event.name,
      dna: event.dna.toString(),
    })

    // Update your UI when events arrive
    addZombieToUI(event)
  })

  console.log('✅ Event listener active! Waiting for zombie creation events...')

  // Return cleanup function
  return unwatch
}

/**
 * Complete test cycle - creates a zombie AND listens for the event
 * Use this for testing/debugging to verify everything works
 */
export async function testEventListening() {
  const CONTRACT_ADDRESS = '0x...' as `0x${string}`
  const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

  console.log('🧪 Starting complete event test...')

  // 1. Start listening for events
  console.log('1️⃣ Setting up event listener...')
  const unwatch = zombieFactory.watchNewZombieEvents((event) => {
    console.log('🔥 Event captured successfully!', event)
    console.log('✅ Event listening is working correctly!')
  })

  // 2. Create a zombie to trigger the event
  console.log('2️⃣ Creating test zombie...')
  try {
    const txHash = await zombieFactory.createRandomZombie('TestZombie')
    console.log('3️⃣ Transaction sent:', txHash)
    console.log(
      '4️⃣ Waiting for event... (may take a few seconds for block confirmation)'
    )
  } catch (error) {
    console.error('❌ Failed to create zombie:', error)
    unwatch() // Clean up on error
    return
  }

  // 3. Auto-cleanup after 30 seconds
  setTimeout(() => {
    console.log('5️⃣ Test completed, stopping event listener...')
    unwatch()
  }, 30000)

  console.log('⏰ Test will auto-complete in 30 seconds')
}

/**
 * Real-time zombie dashboard
 * Example of how to build a live dashboard showing zombie activity
 */
export function createZombieDashboard() {
  const CONTRACT_ADDRESS = '0x...' as `0x${string}`
  const zombieFactory = new ZombieFactory(CONTRACT_ADDRESS)

  let stats = {
    totalZombies: 0,
    recentZombies: [] as any[],
    lastActivity: null as Date | null,
  }

  console.log('📊 Starting zombie dashboard...')

  const unwatch = zombieFactory.watchNewZombieEvents((event) => {
    // Update statistics
    stats.totalZombies++
    stats.lastActivity = new Date()
    stats.recentZombies.unshift({
      id: event.zombieId.toString(),
      name: event.name,
      dna: event.dna.toString(),
      createdAt: new Date(),
    })

    // Keep only last 10 zombies
    if (stats.recentZombies.length > 10) {
      stats.recentZombies = stats.recentZombies.slice(0, 10)
    }

    console.log('📈 Dashboard updated:', stats)
    updateDashboardUI(stats)
  })

  // Show stats every 10 seconds
  const statsInterval = setInterval(() => {
    console.log('📊 Current stats:', stats)
  }, 10000)

  // Return cleanup function
  return () => {
    unwatch()
    clearInterval(statsInterval)
    console.log('📊 Dashboard stopped')
  }
}

/**
 * Debug helper - comprehensive event testing
 * Use when troubleshooting event-related issues
 */
export async function debugEventSystem() {
  console.log('🐛 Starting event system debug...')

  // Test 1: Create and listen for own event
  console.log('\n🧪 Test 1: Complete event cycle')
  await testEventListening()

  // Wait a bit between tests
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // Test 2: Listen for external events
  console.log('\n👂 Test 2: Listening for external events')
  const cleanup = demonstrateEventListening()

  // Stop after 1 minute
  setTimeout(() => {
    console.log('\n🔚 Debug session completed')
    cleanup()
  }, 60000)

  console.log('⏰ Debug will run for 1 minute total')
}

// Helper function to update UI when events arrive
function addZombieToUI(event: any) {
  const zombieList = document.getElementById('zombie-list')
  if (zombieList) {
    const zombieElement = document.createElement('div')
    zombieElement.className = 'zombie-card'
    zombieElement.innerHTML = `
      <div class="zombie-info">
        <h3>🧟 ${event.name}</h3>
        <p><strong>ID:</strong> ${event.zombieId}</p>
        <p><strong>DNA:</strong> ${event.dna}</p>
        <p><strong>Created:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
    `
    zombieList.insertBefore(zombieElement, zombieList.firstChild)
  }
}

// Helper function to update dashboard UI
function updateDashboardUI(stats: any) {
  const dashboard = document.getElementById('zombie-dashboard')
  if (dashboard) {
    dashboard.innerHTML = `
      <h2>📊 Zombie Activity Dashboard</h2>
      <div class="stats">
        <p><strong>Total Zombies:</strong> ${stats.totalZombies}</p>
        <p><strong>Last Activity:</strong> ${
          stats.lastActivity?.toLocaleString() || 'None'
        }</p>
      </div>
      <div class="recent-zombies">
        <h3>Recent Zombies:</h3>
        ${stats.recentZombies
          .map(
            (zombie: any) => `
          <div class="zombie-item">
            ${zombie.name} (ID: ${zombie.id})
          </div>
        `
          )
          .join('')}
      </div>
    `
  }
}
