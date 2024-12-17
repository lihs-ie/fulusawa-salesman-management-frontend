export type Commit<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ValueOf<T> = T[keyof T];

export type ClassPropertyValues<T> = T[{
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T]];

export type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ClassMethodType<T, K extends ClassMethodNames<T>> = T[K] extends (
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never;

export type ClassMethodArgs<T, K extends ClassMethodNames<T>> = Parameters<ClassMethodType<T, K>>;
