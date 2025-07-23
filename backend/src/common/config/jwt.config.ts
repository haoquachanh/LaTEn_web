import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtSecret = () => {
  return {
    key: process.env.JWT_SECRET,
  };
};
export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: jwtSecret().key,
      signOptions: { expiresIn: '30m' },
    };
  },
};

export const refreshTokenConfig = {
  secret: jwtSecret().key + '-refresh',
  expiresIn: '7d',
};
