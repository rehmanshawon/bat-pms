import { Injectable } from '@nestjs/common';
import { ConfigManager } from '@nestjsplus/config';
import * as Joi from '@hapi/joi';
import { KnexOptions } from '../interfaces';
import {
  MassiveConnectOptions,
  MassiveConfigOptions,
} from '@nestjsplus/massive';

import { resolve } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const oracledb = require('oracledb');

if (process.env.ORACLE_CLIENT_DIR) {
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_DIR,
  });
}

@Injectable()
export class KnexConfigService extends ConfigManager {
  // Our custom "schema"
  // We supply it to the ConfigManager by extending the
  // ConfigManager class and implementing the
  // provideConfigSpec() method, which simply returns
  // our custom schema
  provideConfigSpec() {
    return {
      host: {
        validate: Joi.string(),
        required: false,
        default: 'localhost',
      },
      port: {
        validate: Joi.number().min(1000).max(65535),
        required: false,
        default: 5432,
      },
      user: {
        validate: Joi.string(),
        required: true,
      },
      password: {
        validate: Joi.string(),
        required: true,
      },
      database: {
        validate: Joi.string(),
        required: true,
      },
    };
  }

  createKnexOptions(): KnexOptions {
    return {
      client: 'oracledb',
      //log all the user
      log: {
        warn(message) {
          console.log(message);
        },
        error(message) {
          console.log(message);
        },
        debug(message) {
          process.env.NODE_ENV == 'development' ? console.log(message) : '';
        },
      },
      debug: process.env.NODE_ENV == 'production' ? false : true,
      connection: {
        user: this.get<string>('user'),
        password: this.get<string>('password'),
        connectString:
          '(DESCRIPTION=(CONNECT_TIMEOUT=10)(RETRY_COUNT=3)(SOURCE_ROUTE=yes)(ADDRESS_LIST=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=tcp)(HOST=' +
          this.get<string>('host') +
          ')(PORT=' +
          this.get<string>('port') +
          '))(ADDRESS=(PROTOCOL=tcp)(HOST=' +
          this.get<string>('host') +
          ')(PORT=' +
          this.get<string>('port') +
          ')))(ADDRESS_LIST=(FAILOVER=on)(LOAD_BALANCE=off)(ADDRESS=(PROTOCOL=tcp)(HOST=' +
          this.get<string>('host') +
          ')(port=' +
          this.get<string>('port') +
          '))(ADDRESS=(PROTOCOL=tcp)(HOST=' +
          this.get<string>('host') +
          ')(port=' +
          this.get<string>('port') +
          ')))(CONNECT_DATA=(SERVER=DEDICATED)(' +
          process.env.SID_SERVICE_NAME_KEY +
          '=' +
          process.env.SID_SERVICE_NAME_VALUE +
          ')))',
        requestTimeout: 100,
      },
      // for uppercase/lowercase
      // wrapIdentifier: (value, origImpl, queryContext) =>
      //   origImpl(value.toUpperCase()),

      // postProcessResponse: (rows) => {
      //   console.log('len..', rows.length);
      //   let convertedRows = [];
      //   if (rows.length >= 1) {
      //     console.log("row undefined na........")
      //     convertedRows = [...rows];
      //   } else {
      //     console.log("row can be undefined")
      //     convertedRows = [rows];
      //     console.log(convertedRows)
      //   }
      //   return convertedRows.map((row) => {
      //     const check = Object.keys(row).reduce(
      //       (newRow, key) =>
      //         Object.assign(newRow, {
      //           [key.toLowerCase()]: row[key],
      //         }),
      //       {},
      //     );
      //     return check;
      //   });
      // },
      // postProcessResponse: (resp, queryContext) => resp.toLowerCase(),

      // connection: {
      //   host: this.get<string>('host'),
      //   user: this.get<string>('user'),
      //   password: this.get<string>('password'),
      //   database: this.get<string>('database'),
      //   port: this.get<number>('port'),
      //   connectString: '192.168.20.38:1521/orcl',
      // },
    };
  }

  createMassiveConnectOptions(): MassiveConnectOptions {
    return {
      host: this.get<string>('host'),
      user: this.get<string>('user'),
      password: this.get<string>('password'),
      database: this.get<string>('database'),
      port: this.get<number>('port'),
    };
  }

  createMassiveConfigOptions(): MassiveConfigOptions {
    return {
      scripts: resolve(__dirname, '../../', 'dbscripts'),
    };
  }
}
