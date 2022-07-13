import { KnexOptions } from './knex-options.interfaces';

export interface KnexOptionsFactory {
  createKnexOptions(): Promise<KnexOptions> | KnexOptions;
}
