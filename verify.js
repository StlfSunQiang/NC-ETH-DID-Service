const { ethers, upgrades } = require('hardhat');


const artifacts = require('./../artifacts/contracts/logic/IPGathering.sol/IPGathering.json')
const hardhatConfig = require('./../conf/conf.json')

let abi = artifacts.abi

let contractAddress = hardhatConfig.ContractAddress;
let provider = ethers.getDefaultProvider(hardhatConfig.WuhanRpc);
let wallet = new ethers.Wallet(hardhatConfig.opPrivateKey, provider);
let contract = new ethers.Contract(contractAddress, abi, wallet)


describe('verify', function () {
    it('load', async function () {
        let messageHash = ethers.utils.id("Hello World");

// Note: messageHash is a string, that is 66-bytes long, to sign the
//       binary value, we must convert it to the 32 byte Array that
//       the string represents
//
// i.e.
//   // 66-byte string
//   "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"
//
//   ... vs ...
//
//  // 32 entry Uint8Array
//  [ 89, 47, 167, 67, 136, 159, 199, 249, 42, 194, 163,
//    123, 177, 245, 186, 29, 175, 42, 92, 132, 116, 28,
//    160, 224, 6, 29, 36, 58, 46, 103, 7, 186]

        let messageHashBytes = ethers.utils.arrayify(messageHash)

// Sign the binary data
        let flatSig = await wallet.signMessage(messageHashBytes);

// For Solidity, we need the expanded-format of a signature
        let sig = ethers.utils.splitSignature(flatSig);

        let signerAddress = await contract.verify(messageHashBytes, sig.v, sig.r, sig.s);

        console.log(signerAddress)

    })
})