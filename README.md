# exchange-metadapp-nestjs

## Installation

To run the project need install Solidity Compiler and Truffle in your global environment

```bash
# Solidity Compiler
$ npm install -g solc

# Truffle library
$ npm install -g truffle
```

```bash

# Move to backend folder
$ cd backend

# Install all libraries
$ npm install

# Move to evm folder to generate wallets into testnet blockchains
$ cd tasks/wallet-generator/evm

# Generate a new contracts with Truffle
$ truffle deploy --network ethereum

# Generate wallets to give users
$ node run generate.js "quantityWallets" "chainID"
```
