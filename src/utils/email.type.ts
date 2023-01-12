export type Email = string;

const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gs;

export const isEmail = (obj: string): obj is Email => emailRegExp.test(obj);
