// polygon.service.ts
import { Injectable } from '@nestjs/common';
import ContractJson from './artifacts/contracts/ABCall.sol/ABCall_Store_HASH_G3.json';
import { HashDto } from './has.dto';

@Injectable()
export class PolygonService {
  

  async uploadHashToPolygon(hash: string): Promise<HashDto> {
    const hre = require("hardhat");
    const abi = ContractJson.abi;
    try {
      const alchemy = new hre.ethers.AlchemyProvider(
        'maticmum',
        'V0I3KPmc0TjpVa7eat1vfybFjCY8xSMt'
    );
    const alchemyProvider = new hre.ethers.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/V0I3KPmc0TjpVa7eat1vfybFjCY8xSMt");
    const userWallet = new hre.ethers.Wallet("1376797fb8082cc91e93922e4aabbc3f40503507d8c1eaeea5f8f585b0d301dc", alchemyProvider);
    const ABCall = new hre.ethers.Contract(
        "0x8344A05F2E5f4E6Cd0115f69e8ba7372E6924fcA",
        abi,
        userWallet
    )
    
    console.log(hash);
    const setTx1 = await ABCall.storeHash(hash);
    await setTx1.wait();
    const hashCount = await ABCall.hashCount();
    return {hash: setTx1.hash, hashCount: hashCount}

    } catch (error) {
      console.error('Error storing hash: ', error);
      throw new Error('Failed to store hash on the Polygon blockchain');
    }
  }
}
