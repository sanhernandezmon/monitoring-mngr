export class CreateIncidentDto {
    readonly initialDate: Date;
    readonly resolutionDate?: Date;
    readonly clientId: string;
    readonly incidentType: string;
    readonly companyId: string;
    readonly description?: string;
  }