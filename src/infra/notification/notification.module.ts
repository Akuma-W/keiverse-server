import { Global, Module } from '@nestjs/common';

import { EmailModule } from './email/email.module';
import { NotificationFacade } from './notification.facade';
import { SmsModule } from './sms/sms.module';

@Global()
@Module({
  imports: [EmailModule, SmsModule],
  providers: [NotificationFacade],
  exports: [NotificationFacade],
})
export class NotificationModule {}
