import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

// @ValidatorConstraint({ async: false })
// export class IsEqualTo implements ValidatorConstraintInterface {

//   validate(text: string, args: ValidationArguments) {
//     // tslint:disable-next-line: no-console
//     console.log('EqualTo', text);
//     return false;
//     return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Text ($value) is too short or too long!';
//   }
// }

// export function IsEqual(fieldToCompare: string, validationOptions?: ValidationOptions) {
//   // tslint:disable-next-line: ban-types
//   return (object: Object, propertyName: string) => {
//     registerDecorator({
//       name: 'equalTo',
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       constraints: [fieldToCompare],
//       validator: IsEqualTo,
//     });
//   };
// }

export const IsEqual = (property: string, validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === typeof relatedValue &&
            value === relatedValue;
        },
      },
    });
  };
};
