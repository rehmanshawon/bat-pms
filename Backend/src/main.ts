/**dependencies */
import {
  RequestMethod,
  VersioningType,
  ValidationPipe,
  Logger,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DateTime, Settings } from 'luxon';
/**module imports */
import { AppModule } from './app.module';
/**http and response custom interceptors */
import { HttpExceptionFilter } from './apsisengine/common/filter/http-exception.filter';
import { WrapResponseInterceptor } from './apsisengine/common/interceptors/wrap-response.interceptor';
import * as express from 'express';
import * as path from 'path';
import { types } from 'pg';
import { json, urlencoded } from 'express';
import { initAdapters } from './adapters.init';
const SWAGGER_ENVS = ['development', 'local'];

async function bootstrap() {
  //set the date time timezone
  DateTime.local().setZone(process.env.TZ || 'Asia/Dhaka');
  Settings.defaultZone = 'Asia/Dhaka';
  types.setTypeParser(1700, function (val) {
    return parseFloat(val);
  });
  // const DATE_OID = 1082;
  // const parseDate = (value) => value;

  // types.setTypeParser(DATE_OID, parseDate);
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('ApplicationStartUp'),
    cors: true,
  });
  initAdapters(app);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  //set basic auth for accessing swagger api
  if (SWAGGER_ENVS.includes(process.env.NODE_ENV || 'development')) {
    app.use(
      ['/apidoc'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  //serve static file from directory
  app.use('/public', express.static(path.join(__dirname, '../..', 'public')));

  //setting the global prefix for routing and versiong routes
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // exception factory for custom validation error message as key value pair
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   const response_data = {};
      //   validationErrors.filter(function (values) {
      //     response_data[values.property] = Object.keys(values.constraints).map(
      //       (k) => values.constraints[k],
      //     );
      //   });
      //   return new BadRequestException(response_data);
      // },
    }),
  );

  //swagger for api documentation
  const config = new DocumentBuilder()
    .setTitle('IFIC')
    .setDescription('Banking ERP Application')
    .setLicense('Apsis Solutions Ltd', 'https://apsissolutions.com/')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  //use custom made global handlers to use in app
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const app_port = parseInt(process.env.APP_PORT) || 4000;
  await app.listen(app_port);
  Logger.log(`Application is running on port: ${app_port}`);
}
bootstrap();
