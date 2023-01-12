import { Exception } from '../../../utils/exception.type';

export class EmailAlreadyUsed extends Exception {
  constructor(message?: string) {
    super(message ?? `Email already used`);
  }
}
