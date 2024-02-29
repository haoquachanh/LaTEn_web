// src/common/decorators/format-data.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FormatData = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (result: any, ctx: ExecutionContext) => {
    if (!result) {
      return {
        err: '1',
        mes: 'No action!',
        // data: null,
      };
    }
    const formattedData = {
      err: result.err ?? 1,
      mes: result.mes ?? "ok",
      data: result
    };

    return formattedData;
  },
);
