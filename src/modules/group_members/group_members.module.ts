import { Module } from '@nestjs/common';
import { GroupMembersService } from './group_members.service';
import { GroupMembersController } from './group_members.controller';

@Module({
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}
