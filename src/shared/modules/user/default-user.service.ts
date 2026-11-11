import { isObjectIdOrHexString, type Model } from 'mongoose';
import { inject, injectable } from 'inversify';
import { hashPassword } from '../../helpers/hash-password.js';
import { Component } from '../../types/component.js';
import type { CreateUserDto } from './create-user.dto.js';
import type { UserDocument, UserEntity } from './user.entity.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel)
    private readonly userModel: Model<UserEntity>,
  ) {}

  public async create(data: CreateUserDto, salt: string): Promise<UserDocument> {
    const password = await hashPassword(data.password, salt);

    return this.userModel.create({
      name: data.name,
      email: data.email.trim().toLowerCase(),
      avatarUrl: data.avatarUrl,
      password,
      type: data.type,
    });
  }

  public async findById(id: string): Promise<UserDocument | null> {
    if (!isObjectIdOrHexString(id)) {
      return null;
    }

    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }
}
