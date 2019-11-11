export const toNumber = (input: string | number): number => (typeof input === 'string') ? parseInt(input, 10) : input;
export const monthsToSeconds = months => toNumber(months) * 12 * 24 * 60 * 60;
export const secondsToMonths = seconds => toNumber(seconds) / 12 / 24 / 60 / 60;
