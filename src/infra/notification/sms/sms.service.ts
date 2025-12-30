import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { NotificationChannel } from '../interfaces/notification-channel.interface';
import { NotificationPayload } from '../interfaces/notification-payload.interface';

@Injectable()
export class SmsService implements NotificationChannel {
  private readonly logger = new Logger(SmsService.name);
  private client: Twilio;

  constructor(private readonly config: ConfigService) {
    this.client = new Twilio(
      config.get('infra.twilio.account_sid'),
      config.get('infra.twilio.auth_token'),
    );
  }

  async send(payload: NotificationPayload): Promise<void> {
    await this.client.messages.create({
      body: payload.content,
      from: this.config.get('infra.twilio.from'),
      to: payload.to,
    });

    this.logger.log(`SMS sent to ${payload.to}`);
  }
}
