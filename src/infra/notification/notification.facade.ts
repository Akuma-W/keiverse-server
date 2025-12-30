import { Injectable } from '@nestjs/common';

import { EmailService } from './email/email.service';
import { NotificationPayload } from './interfaces/notification-payload.interface';
import { SmsService } from './sms/sms.service';

@Injectable()
export class NotificationFacade {
  constructor(
    private readonly email: EmailService,
    private readonly sms: SmsService,
  ) {}

  async sendEmail(payload: NotificationPayload) {
    return this.email.send(payload);
  }

  async sendSms(payload: NotificationPayload) {
    return this.sms.send(payload);
  }

  async sentOtp(to: string, otp: string) {
    const content = `Your OTP code is ${otp}. It will expire in 5 minutes.`;

    if (to.includes('@')) {
      return this.sendEmail({
        to,
        subject: `OTP Verification`,
        content,
      });
    }
    return this.sendSms({
      to,
      content,
    });
  }
}
