import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupMemberDto } from './create-group_member.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMemberDto) {}
