/* eslint-disable prettier/prettier */
import { Injectable, Inject, Logger } from '@nestjs/common';
import { KNEX_OPTIONS } from './constants';
import { KnexOptions } from './interfaces';

// tslint:disable-next-line: no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Knex = require('knex');

interface IKnexService {
  getKnex();
}

@Injectable()
export class KnexService implements IKnexService {
  private readonly logger: Logger;
  private _knexConnection: any;
  constructor(@Inject(KNEX_OPTIONS) private _knexOptions: KnexOptions) {
    this.logger = new Logger('KnexService');
    this.logger.log('Knex Service Initialized');
  }

  getKnex() {
    if (!this._knexConnection) {
      this._knexConnection = new Knex(this._knexOptions);
    }
    return this._knexConnection;
    // const conn = this._knexConnection.transactionProvider();
    // const knex = conn();
    // return knex;
  }
}
