import env from './default_env.json';

const baseUrl = process.env.API_URL || env.API_URL;
export const helloWorldApi = baseUrl + '/helloWorld';
