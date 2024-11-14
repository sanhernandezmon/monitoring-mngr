// polygon.service.ts
import { Injectable } from '@nestjs/common';
import { HashDto } from './has.dto';

@Injectable()
export class PolygonService {
  

  async uploadHashToPolygon(hash: string): Promise<HashDto> {
    const ethers = require("ethers");
    const abi =  [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "getHash",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_string",
            "type": "string"
          }
        ],
        "name": "storeHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stringCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "strings",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    try {
    const alchemyProvider = new ethers.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/V0I3KPmc0TjpVa7eat1vfybFjCY8xSMt");
    const userWallet = new ethers.Wallet("1376797fb8082cc91e93922e4aabbc3f40503507d8c1eaeea5f8f585b0d301dc", alchemyProvider);
    const ABCall = new ethers.Contract(
        "0x2e8919D75F5FC5574e929E80Ce5c3b21AB0663CA",
        abi,
        userWallet
    )
    
    console.log(hash);
    const setTx1 = await ABCall.storeHash(hash);
    await setTx1.wait();
    const hashCount = await ABCall.stringCount();
    return {hash: setTx1.hash, hashCount: hashCount}

    } catch (error) {
      console.error('Error storing hash: ', error);
      throw new Error('Failed to store hash on the Polygon blockchain');
    }
  }
}
