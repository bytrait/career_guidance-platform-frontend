/**
 * Fisher-Yates (Knuth) array shuffle algorithm.
 * Returns a new shuffled array without mutating the original.
 *
 * @param {Array} array
 * @returns {Array} Shuffled copy of the input array
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
