import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class ManufacturerDto {
  
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber("any")
  phone: string;

  @IsNotEmpty()
  siret: number;
  
}