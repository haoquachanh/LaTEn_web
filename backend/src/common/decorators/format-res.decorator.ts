import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FormatData = createParamDecorator((result: any, _ctx: ExecutionContext) => {
  if (!result) {
    return {
      err: '1',
      mes: 'No action!',
    };
  }
  const formattedData = {
    err: result.err ?? 1,
    mes: result.mes ?? 'ok',
    data: result,
  };

  return formattedData;
});
