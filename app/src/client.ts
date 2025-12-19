import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { mainnet } from 'viem/chains'
import './window.d.ts'
// ou a rede que você estiver utilizando (ex: goerli, sepolia)

// Para leitura de dados
const publicClient = createPublicClient({
  chain: mainnet, // Especifique a rede
  transport: http(), // Use um provedor HTTP, como Infura ou Alchemy (opcionalmente passando URL)
})

// Para escrita de dados (conectando a uma carteira, ex: MetaMask no navegador)
// Certifique-se de que a carteira do usuário esteja disponível no objeto global (window.ethereum)
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum!),
})
