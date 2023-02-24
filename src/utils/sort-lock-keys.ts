interface Sortable {
  [key: string]: string | Sortable;
}

export const sortLockKeys = (object: Sortable) =>
  Object.keys(object)
    .sort()
    .reduce<Sortable>((acc, key) => {
      const value = object[key];
      acc[key] =
        value && typeof value === 'object' ? sortLockKeys(value) : value;
      return acc;
    }, {});
