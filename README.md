# Election - DAPP Tutorial
Build Dapp on the Ethereum Network (update 3/2025)

**Full Free Video Tutorial:**
(this video is an old version, there are some changes by now)
https://youtu.be/3681ZYbDSSk

**Full Free Article Tutorial:**
https://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial

## Dependencies
Install these prerequisites
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/

## Step 1. Clone the project
* The 2019 update version: `git clone https://github.com/dappuniversity/election.git`
* Or clone this repo for 2025 update version

## Step 2. Install dependencies
```
$ cd election
$ npm install
```

## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance. See free video tutorial for full explanation.

## Step 4. Compile & Deploy Election Smart Contract
`$ truffle migrate --reset`
You must migrate the election smart contract each time your restart ganache.

## Step 5. Configure Metamask
See free video tutorial for full explanation of these steps:
- Unlock Metamask
- Connect metamask to your local Etherum blockchain provided by Ganache.
- Import an account provided by ganache.

## Step 6. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000