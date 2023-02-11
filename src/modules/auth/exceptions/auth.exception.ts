export class EmailAlreadyUsed extends Error {
  constructor(message = `Email already used`) {
    super(message);
  }
}
