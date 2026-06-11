// Decorators that declare validation rules per property.
import { IsUUID, IsIn } from 'class-validator';
export class CreateMembershipDto {
  
  @IsUUID()
  profileId!: string;

  @IsUUID()
  breweryId!: string;
  
  @IsIn(['OWNER', 'ADMIN', 'BREWER', 'STAFF'])
  role!: string;
}