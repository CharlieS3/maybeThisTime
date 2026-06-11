// Decorators that declare validation rules per property.
import { IsString, Length } from 'class-validator';

export class CreateBreweryDto {
  @IsString()      // must be a string (rejects numbers, objects...)
  @Length(3, 50)    // Must be 3 characters long and cannot be any longer than 50
  name!: string;
}