import { Entity, Repository, getRepository } from 'typeorm';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { createParamDecorator, ExecutionContext, Inject, ArgumentsHost, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { getAction, CrudConfigService } from '@nestjsx/crud';
import { REQUEST, HttpAdapterHost } from '@nestjs/core';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const entity = args.constraints[0];
    const repo: Repository<any> = getRepository(entity);
    const conditions = {};

    conditions[args.property] = value;

    return await repo.find(conditions)
      .then(record => {
        return record.length ? false : true;
      });
  }

  defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
    return 'Record already exists with ($value)';
  }
}

export function IsUnique(entity: any, column?: string, idColumn?: string, idValue?: any, validationOptions?: ValidationOptions) {
  // tslint:disable-next-line: no-console
  // tslint:disable-next-line: ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, column, idValue, idColumn],
      validator: IsUniqueConstraint,
    });
  };
}

export interface UniqueColumn {
  name: string; // Column name
  field: string; // Request field name
  entity: any; // Entitry to use for database operation
  idField?: string; // Record ID field name
  id?: string | number; // Record ID value
  mode: 'Create' | 'Update';
  message?: string;
  table: string;
}

export const ValidateUniqueParam = createParamDecorator(
  async (column: UniqueColumn, args: ArgumentsHost) => {
    const request = args.switchToHttp().getRequest();
    const col = Object.assign({
      idField: 'id',
      mode: 'Create',
      message: `Record already exists with (${request.body[column.field]})`,
    }, column);

    if (!request.body[col.field]) {
      return false;
    }

    const qb = getRepository(col.entity).createQueryBuilder(col.table);

    if (col.mode === 'Update' && request.params.id) {
      qb.where(`${col.idField} != :id`, { id: request.params.id });
    }

    const exists = await qb.andWhere(`${col.field} = :col`, { col: request.body[col.field] })
      .getCount();

    if (exists) {
      const err = {};
      err[col.field] = col.message;
      throw new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: [err],
      });
    }

    return true;
  },
);
