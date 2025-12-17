//Compile antes de deploy
npx hardhat compile
//Rodar o deploy com Ignition - Local
npx hardhat ignition deploy ./ignition/modules/CounterModule.ts
//Rodar o deploy com Ignition - Sepolia
npx hardhat ignition deploy ./ignition/modules/CounterModule.ts --network sepolia
