#!/usr/bin/env node

/**
 * Script para sincronizar a ABI do contrato ZombieFactory
 * do projeto web3 para o projeto app
 */

const fs = require('fs')
const path = require('path')

const WEB3_ARTIFACT_PATH =
  '../web3/artifacts/contracts/ZombieFactory.sol/ZombieFactory.json'
const APP_ABI_PATH = 'src/contracts/ZombieFactory.abi.ts'

function syncAbi() {
  try {
    // Verifica se o artifact existe
    const artifactPath = path.resolve(__dirname, WEB3_ARTIFACT_PATH)
    if (!fs.existsSync(artifactPath)) {
      console.error('❌ Artifact não encontrado:', artifactPath)
      console.log('💡 Execute "npx hardhat compile" no projeto web3 primeiro')
      process.exit(1)
    }

    // Lê o artifact
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))

    if (!artifact.abi) {
      console.error('❌ ABI não encontrada no artifact')
      process.exit(1)
    }

    // Gera o conteúdo TypeScript
    const abiContent = `import type { Abi } from "viem";

export const ZombieFactoryAbi = ${JSON.stringify(
      artifact.abi,
      null,
      2
    )} as const satisfies Abi;
`

    // Escreve o arquivo
    const outputPath = path.resolve(__dirname, '..', APP_ABI_PATH)
    fs.writeFileSync(outputPath, abiContent)

    console.log('✅ ABI sincronizada com sucesso!')
    console.log('📁 Arquivo atualizado:', outputPath)
    console.log(
      '📊 Funções encontradas:',
      artifact.abi.filter((item) => item.type === 'function').length
    )
    console.log(
      '📡 Eventos encontrados:',
      artifact.abi.filter((item) => item.type === 'event').length
    )
  } catch (error) {
    console.error('❌ Erro ao sincronizar ABI:', error.message)
    process.exit(1)
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  syncAbi()
}

module.exports = { syncAbi }
