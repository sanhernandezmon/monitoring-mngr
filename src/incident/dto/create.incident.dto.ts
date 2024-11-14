import { IncidentState } from "../state";

export class CreateIncidentDto {
    readonly timestamp: string;
    readonly clientId: string;
    readonly state: IncidentState;
    readonly companyId: string;
    readonly description?: string;
    readonly polygonHash? : string;
    readonly polygonCount? : number;
  }