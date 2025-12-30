import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

import { NotificationChannel } from '../interfaces/notification-channel.interface';
import { NotificationPayload } from '../interfaces/notification-payload.interface';

@Injectable()
export class EmailService implements NotificationChannel {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('infra.email.host'),
      port: Number(this.config.get('infra.email.port')),
      secure: false,
      auth: {
        user: this.config.get<string>('infra.email.user'),
        pass: this.config.get<string>('infra.email.pass'),
      },
    });
  }

  async send(payload: NotificationPayload): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('infra.email.from'),
      to: payload.to,
      subject: payload.subject,
      text: payload.content,
    });

    this.logger.log(`Email sent to ${payload.to}`);
  }
}
