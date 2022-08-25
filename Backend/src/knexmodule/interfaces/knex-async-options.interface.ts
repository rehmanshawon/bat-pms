/* eslint-disable prettier/prettier */
/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { KnexOptions } from './knex-options.interfaces';
import { KnexOptionsFactory } from './knex-options-factory.interface';

/* Interfaces */

export interface KnexAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<KnexOptionsFactory>;
  useClass?: Type<KnexOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KnexOptions> | KnexOptions;
}
