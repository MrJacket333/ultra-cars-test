import { IsNotEmpty, IsDate } from "class-validator";

export class OwnerDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  purchaseDate: Date;
}