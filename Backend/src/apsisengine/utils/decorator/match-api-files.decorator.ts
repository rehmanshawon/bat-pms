import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger';

export const MatchApiFiles =
  (options?: ApiPropertyOptions): PropertyDecorator =>
  (target: any, propertyKey: string | symbol) => {
    if (options?.isArray) {
      ApiProperty({
        type: 'array',
        items: {
          type: 'file',
          properties: {
            [propertyKey]: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })(target, propertyKey);
    }
  };
