import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtSecret = () => ({
  key: process.env.JWT_SECRET,
});

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: jwtSecret().key,
      signOptions: { expiresIn: '60m' },
    };
  },
};
