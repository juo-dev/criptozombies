import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { network } from 'hardhat'

// Função para gerar nomes aleatórios de zombies
function generateRandomZombieName(): string {
  const prefixes = [
    'Zombie',
    'Undead',
    'Rotten',
    'Decayed',
    'Ghoul',
    'Walker',
    'Shambler',
    'Crawler',
    'Stalker',
    'Hunter',
  ]
  const suffixes = [
    'Killer',
    'Destroyer',
    'Eater',
    'Biter',
    'Ripper',
    'Terror',
    'Nightmare',
    'Horror',
    'Doom',
    'Death',
  ]

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  const number = Math.floor(Math.random() * 1000)

  return `${prefix}${suffix}${number}`
}

describe('ZombieFactory', async function () {
  const { viem } = await network.connect()
  const publicClient = await viem.getPublicClient()

  it('Should emit the NewZombie event when calling createRandomZombie()', async function () {
    const zombieFactory = await viem.deployContract('ZombieFactory')
    const zombieName = generateRandomZombieName()
    const deploymentBlockNumber = await publicClient.getBlockNumber()

    await zombieFactory.write.createRandomZombie([zombieName])

    const events = await publicClient.getContractEvents({
      address: zombieFactory.address,
      abi: zombieFactory.abi,
      eventName: 'NewZombie',
      fromBlock: deploymentBlockNumber,
      strict: true,
    })

    assert.equal(events.length, 1, 'Should emit one NewZombie event')
    const event = events[0]
    const { zombieId, name, dna } = event.args as {
      zombieId: bigint
      name: string
      dna: bigint
    }

    assert.equal(typeof zombieId, 'bigint', 'zombieId should be bigint')
    assert.equal(name, zombieName, 'Name should match')
    assert.equal(typeof dna, 'bigint', 'DNA should be bigint')
    assert(dna >= 0n, 'DNA should be non-negative')
    assert(dna < 10n ** 16n, 'DNA should be less than 10^16')
  })

  it('Should create multiple zombies with random names and validate events', async function () {
    const zombieFactory = await viem.deployContract('ZombieFactory')
    const deploymentBlockNumber = await publicClient.getBlockNumber()

    // Gerar nomes aleatórios e criar zombies
    const zombieNames: string[] = []
    const numZombies = 5

    for (let i = 0; i < numZombies; i++) {
      const name = generateRandomZombieName()
      zombieNames.push(name)
      await zombieFactory.write.createRandomZombie([name])
    }

    // Buscar todos os eventos NewZombie
    const events = await publicClient.getContractEvents({
      address: zombieFactory.address,
      abi: zombieFactory.abi,
      eventName: 'NewZombie',
      fromBlock: deploymentBlockNumber,
      strict: true,
    })

    // Validar que todos os zombies foram criados
    assert.equal(events.length, numZombies, 'Should have created all zombies')

    // Validar cada evento
    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      const { zombieId, name, dna } = event.args as {
        zombieId: bigint
        name: string
        dna: bigint
      }

      assert.equal(zombieId, BigInt(i), `Zombie ID should be ${i}`)
      assert.equal(name, zombieNames[i], `Zombie name should match`)
      assert.equal(typeof dna, 'bigint', 'DNA should be a bigint')
      assert(dna >= 0n, 'DNA should be non-negative')
      assert(dna < 10n ** 16n, 'DNA should be less than 10^16')
    }

    // Validar que podemos ler os zombies do contrato
    for (let i = 0; i < numZombies; i++) {
      const zombie = (await zombieFactory.read.zombies([BigInt(i)])) as [
        string,
        bigint,
      ]
      assert.equal(zombie[0], zombieNames[i], 'Zombie name should match')
      assert.equal(typeof zombie[1], 'bigint', 'Zombie DNA should be a bigint')
    }
  })

  it('Should generate different DNA for different names', async function () {
    const zombieFactory = await viem.deployContract('ZombieFactory')
    const deploymentBlockNumber = await publicClient.getBlockNumber()

    const name1 = generateRandomZombieName()
    const name2 = generateRandomZombieName()

    // Garantir que os nomes são diferentes
    if (name1 === name2) {
      throw new Error('Generated same name twice, this is very unlikely')
    }

    await zombieFactory.write.createRandomZombie([name1])
    await zombieFactory.write.createRandomZombie([name2])

    const events = await publicClient.getContractEvents({
      address: zombieFactory.address,
      abi: zombieFactory.abi,
      eventName: 'NewZombie',
      fromBlock: deploymentBlockNumber,
      strict: true,
    })

    assert.equal(events.length, 2, 'Should have created 2 zombies')

    const args1 = events[0].args as {
      zombieId: bigint
      name: string
      dna: bigint
    }
    const args2 = events[1].args as {
      zombieId: bigint
      name: string
      dna: bigint
    }
    const dna1 = args1.dna
    const dna2 = args2.dna

    // DNA deve ser diferente para nomes diferentes
    assert.notEqual(dna1, dna2, 'Different names should generate different DNA')
  })
})
