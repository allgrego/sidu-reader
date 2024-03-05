/**
 * Wait for N milliseconds
 *
 * @param {number} ms milliseconds to wait
 *
 * @return {Promise<void>}
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
