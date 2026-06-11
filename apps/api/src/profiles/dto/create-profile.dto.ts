// Decorators that declare validation rules per property.
import { IsString, Length, IsUUID, IsIn, IsEmail, IsOptional } from 'class-validator';

export class CreateProfileDto {

  @IsString()
  @Length(4, 25)
  username!: string;

  @IsString()
  @Length(12, 128)
  password!: string;

  @IsString()
  @Length(2, 50)
  firstName!: string;

  @IsString()
  @Length(2, 50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @Length(6, 15)
  phone?: string;

  @IsUUID()
  breweryId!: string;

  @IsIn(['OWNER', 'ADMIN', 'BREWER', 'STAFF'])
  role!: string;
}