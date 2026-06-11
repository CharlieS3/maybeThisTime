// Decorators that declare validation rules per property.
import { IsString, Length, IsUUID, IsIn } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(3, 50)
  firstName!: string;

  @IsUUID()
  breweryId!: string;

  @IsIn(['OWNER', 'ADMIN', 'BREWER', 'STAFF'])
  role!: string;
}