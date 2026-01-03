import { Module } from '@nestjs/common';
import { ForumPostsService } from './forum_posts.service';
import { ForumPostsController } from './forum_posts.controller';

@Module({
  controllers: [ForumPostsController],
  providers: [ForumPostsService],
})
export class ForumPostsModule {}
