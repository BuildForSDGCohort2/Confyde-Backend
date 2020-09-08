import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  driver: process.env.MAIL_DRIVER || 'smtp',
  host: process.env.MAIL_HOST || 'local',
  port: parseInt(process.env.MAIL_PORT, 10) || '25',
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  secure: process.env.MAIL_ENCRYPTION === 'ssl',
  fromName: process.env.MAIL_FROM_NAME,
  fromEmail: process.env.MAIL_FROM_EMAIL,
  footer:
    process.env.MAIL_DEFAULT_FOOTER ||
    `Copyright ${new Date().getFullYear().toString()} ${process.env.APP_NAME}`,
}));
