import env from './env.json';

const baseUrl = process.env.BASE_URL || env.BASE_URL;
export const helloWorldApi = baseUrl + '/helloWorld';
