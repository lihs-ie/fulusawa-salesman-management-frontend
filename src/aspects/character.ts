import seedrandom from 'seedrandom';

export const createDigits = (seed: number, length: number | null = null): string => {
  const pseudo = seedrandom(seed.toString());

  const targetLength = length ?? Math.floor(pseudo() * 10) + 1;

  if (targetLength < 1) {
    throw new Error('Length must be 1 or greater.');
  }

  let result = '';

  for (let i = 0; i < targetLength; i++) {
    const digit = Math.floor(pseudo() * 10);
    result += digit;
  }

  return result;
};
