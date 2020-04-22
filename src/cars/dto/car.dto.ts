import { OwnerDto } from './owner.dto';
import { ManufacturerDto } from './manufacturer.dto';
import { IsNotEmpty, IsNumber, IsDate, IsBoolean } from "class-validator";

export class CarDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDate()
  firstRegistrationDate: Date;

  manufacturer: ManufacturerDto;

  @IsNotEmpty()
  @IsBoolean()
  discount: boolean;
    
  owners: OwnerDto[];

}