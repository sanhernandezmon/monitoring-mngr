import { Injectable } from '@nestjs/common'; 
import { PinataSDK } from 'pinata-web3';
import { Incident } from 'src/incident/incident.schema';

@Injectable()
export class PinataService {

  constructor() {}

  async uploadIncident(incident: Incident): Promise<string> {
    const pinata = new PinataSDK({
      pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MzQzNjk2Zi0xYmZlLTQ0ODItYTI0Ny1mOTQwZGQ0MzRkNTEiLCJlbWFpbCI6ImVsc2FudGltb250YW5vQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1YmY5MDU0MjIwYzdlMWEwMjZkNCIsInNjb3BlZEtleVNlY3JldCI6IjcwOTVjN2ZmN2VmMTg0YmQ3MTk2YmIwMGE4MWU0MzA5MmI5YjZlYzA4ZTM0MjQ4OTk2NjVhZTU1MmVmMDQzODIiLCJleHAiOjE3NjI4ODE3NDd9.YYvaNJMfMHEvQJZKE9fliBSrKLhP-iwgyBpTyDaxk0s",
      pinataGateway: "magenta-kind-lark-284.mypinata.cloud"
    });

    try {
      const uploadHash = await pinata.upload.json(incident);
      return uploadHash.IpfsHash;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload incident to Pinata');
    }
  }
}
