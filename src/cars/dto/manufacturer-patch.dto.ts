import { IsPhoneNumber } from 'class-validator';

export class ManufacturerPatchDto {

  name: string;

  @IsPhoneNumber("any")
  phone: string;

  siret: number;
}