import { registerAs } from '@nestjs/config';
import { toBool } from '../helpers';

const decodeAppKey = (key: string) => {
  if (key === undefined || key === '' || key === null) {
    return null;
  }

  return Buffer.from(key, 'base64');
};

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  environment: process.env.APP_ENV || 'local',
  port: parseInt(process.env.PORT, 10) || '5000',
  decodedKey: decodeAppKey(process.env.APP_KEY),
  key: process.env.APP_KEY,
  debug: toBool(process.env.APP_DEBUG),
  url: process.env.APP_URL,
  base_path: process.env.APP_BASE_PATH,
  tokenExpiresIn: 60 * 60 * 24,
  frontendUrl: process.env.APP_FRONTEND_URL,
  logo:
    process.env.APP_LOGO ||
    'https://via.placeholder.com/150x50/CCCCCC/000000?text=EZPark.NG',
  supportEmail: 'support@confyde.com',
}));
