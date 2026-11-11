import 'reflect-metadata';
import { Container } from 'inversify';
import type { Model } from 'mongoose';
import { Application } from './app/application.js';
import { PinoLogger } from './shared/libs/logger/pino-logger.js';
import { RestConfig } from './shared/libs/config/rest-config.js';
import type { Logger } from './shared/libs/logger/logger.interface.js';
import type { Config } from './shared/libs/config/config.interface.js';
import type { DatabaseClient } from './shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from './shared/libs/database-client/mongo-database-client.js';
import { DefaultUserService, UserModel } from './shared/modules/user/index.js';
import type { UserEntity, UserService } from './shared/modules/user/index.js';
import { DefaultOfferService, OfferModel } from './shared/modules/offer/index.js';
import type { OfferEntity, OfferService } from './shared/modules/offer/index.js';
import { Component } from './shared/types/component.js';

export const container = new Container();

container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
container.bind<Config>(Component.Config).to(RestConfig).inSingletonScope();
container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
container.bind<Model<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
container.bind<Model<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
container.bind<Application>(Component.Application).to(Application).inSingletonScope();
