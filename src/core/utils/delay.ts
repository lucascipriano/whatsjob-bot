const delay = <T>(t: number, v: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(v), t));
};
export { delay };
