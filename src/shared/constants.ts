export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const USER_REPOSITORY = 'USER_REPOSITORY';

export enum ServiceTypesEnum {
  PARKING = 'PARKING',
  VALUE_ADDED = 'VALUE_ADDED',
}

export enum AttendantTypesEnum {
  VALET = 'VALET',
  PARKING = 'PARKING',
  SERVICE = 'SERVICE',
  GENERAL = 'GENERAL',
}

export enum ClientTypesEnum {
  BUSINESS = 'BUSINESS',
  EVENT_PLANNER = 'EVENT_PLANNER',
  OTHERS = 'OTHERS',
}

export const STRINGS = {
  auth: {
    login: {
      invalid: 'Authentication failed, invalid credentials',
    },
    password: {
      reset: 'Password reset link sent to the email address if you are a registered user'
    }
  }
}
