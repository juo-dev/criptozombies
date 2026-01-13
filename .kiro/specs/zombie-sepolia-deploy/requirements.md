# Requirements Document

## Introduction

Este documento define os requisitos para implementar um sistema completo de deploy do contrato ZombieFactory na rede de teste Sepolia, incluindo configuração de wallet, scripts de deploy, verificação e documentação.

## Glossary

- **ZombieFactory**: Contrato inteligente que permite criar zombies com DNA aleatório
- **Sepolia**: Rede de teste Ethereum para desenvolvimento e testes
- **Deploy_Script**: Script automatizado para fazer deploy do contrato na blockchain
- **Wallet_Manager**: Sistema para gerenciar chaves privadas e configurações de wallet
- **Contract_Verifier**: Sistema para verificar o código do contrato no Etherscan
- **Environment_Manager**: Sistema para gerenciar variáveis de ambiente e configurações

## Requirements

### Requirement 1: Configuração de Wallet e Ambiente

**User Story:** Como desenvolvedor, eu quero configurar uma wallet e variáveis de ambiente, para que eu possa fazer deploy seguro na rede Sepolia.

#### Acceptance Criteria

1. WHEN o desenvolvedor executa o setup inicial, THE Environment_Manager SHALL criar um arquivo .env com as variáveis necessárias
2. WHEN as variáveis de ambiente são carregadas, THE Wallet_Manager SHALL validar a presença da chave privada e RPC URL
3. WHEN a configuração é validada, THE System SHALL confirmar conectividade com a rede Sepolia
4. THE Environment_Manager SHALL fornecer instruções claras para obter ETH de teste do faucet Sepolia
5. WHEN a wallet é configurada, THE System SHALL verificar se possui saldo suficiente para deploy

### Requirement 2: Scripts de Deploy

**User Story:** Como desenvolvedor, eu quero scripts automatizados de deploy, para que eu possa fazer deploy do ZombieFactory de forma consistente e confiável.

#### Acceptance Criteria

1. WHEN o script de deploy é executado, THE Deploy_Script SHALL compilar o contrato ZombieFactory
2. WHEN a compilação é bem-sucedida, THE Deploy_Script SHALL fazer deploy na rede Sepolia
3. WHEN o deploy é concluído, THE Deploy_Script SHALL retornar o endereço do contrato deployado
4. WHEN o deploy falha, THE Deploy_Script SHALL fornecer mensagens de erro claras e acionáveis
5. THE Deploy_Script SHALL salvar informações do deploy (endereço, hash da transação, gas usado) em arquivo JSON
6. WHEN o contrato é deployado, THE Deploy_Script SHALL verificar se o deploy foi bem-sucedido chamando uma função do contrato

### Requirement 3: Verificação do Contrato

**User Story:** Como desenvolvedor, eu quero verificar o código do contrato no Etherscan, para que outros possam auditar e interagir com o contrato de forma transparente.

#### Acceptance Criteria

1. WHEN o deploy é bem-sucedido, THE Contract_Verifier SHALL automaticamente verificar o código fonte no Etherscan
2. WHEN a verificação é solicitada, THE Contract_Verifier SHALL usar as configurações corretas de compilação
3. WHEN a verificação falha, THE Contract_Verifier SHALL fornecer instruções para verificação manual
4. THE Contract_Verifier SHALL confirmar que a verificação foi bem-sucedida
5. WHEN a verificação é concluída, THE System SHALL fornecer o link do Etherscan para o contrato verificado

### Requirement 4: Testes de Integração

**User Story:** Como desenvolvedor, eu quero testes que validem o deploy, para que eu possa ter confiança de que o contrato funciona corretamente na rede Sepolia.

#### Acceptance Criteria

1. WHEN os testes de integração são executados, THE Test_Suite SHALL conectar com o contrato deployado na Sepolia
2. WHEN conectado ao contrato, THE Test_Suite SHALL testar a criação de um zombie
3. WHEN um zombie é criado, THE Test_Suite SHALL verificar se o evento NewZombie foi emitido
4. WHEN o evento é verificado, THE Test_Suite SHALL confirmar que o zombie foi armazenado corretamente
5. THE Test_Suite SHALL testar a função getZombiesCount para verificar o estado do contrato

### Requirement 5: Documentação e Comandos

**User Story:** Como desenvolvedor, eu quero documentação clara e comandos npm, para que eu possa facilmente executar todo o processo de deploy.

#### Acceptance Criteria

1. THE Documentation SHALL fornecer instruções passo-a-passo para configuração inicial
2. THE Documentation SHALL incluir comandos npm para todas as operações (deploy, verify, test)
3. WHEN a documentação é seguida, THE Developer SHALL conseguir fazer deploy sem conhecimento prévio do projeto
4. THE Documentation SHALL incluir troubleshooting para problemas comuns
5. THE Package_JSON SHALL incluir scripts para deploy, verificação e testes na Sepolia

### Requirement 6: Gerenciamento de Gas e Custos

**User Story:** Como desenvolvedor, eu quero controle sobre os custos de gas, para que eu possa otimizar os gastos durante o deploy.

#### Acceptance Criteria

1. WHEN o deploy é executado, THE Deploy_Script SHALL estimar o gas necessário antes do deploy
2. WHEN o gas é estimado, THE Deploy_Script SHALL mostrar o custo estimado em ETH
3. THE Deploy_Script SHALL permitir configuração de gas price e gas limit
4. WHEN o deploy é concluído, THE Deploy_Script SHALL reportar o gas real utilizado e custo final
5. IF o saldo da wallet é insuficiente, THEN THE Deploy_Script SHALL fornecer instruções para obter mais ETH de teste

### Requirement 7: Backup e Recuperação

**User Story:** Como desenvolvedor, eu quero backup das informações de deploy, para que eu possa recuperar informações importantes se necessário.

#### Acceptance Criteria

1. WHEN um deploy é bem-sucedido, THE System SHALL salvar todas as informações em arquivo deployments.json
2. THE Backup_System SHALL incluir endereço do contrato, hash da transação, block number e timestamp
3. WHEN múltiplos deploys são feitos, THE System SHALL manter histórico de todos os deploys
4. THE System SHALL permitir consulta de deploys anteriores por data ou endereço
5. WHEN informações são salvas, THE System SHALL validar a integridade dos dados salvos
