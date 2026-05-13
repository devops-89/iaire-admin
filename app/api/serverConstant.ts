const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const serverConstants = {
  users: `${baseURL}/users`,
  base: `${baseURL}`,
  auth: `${baseURL}/auth`,
  plans: `${baseURL}/plans`,
  payment: `${baseURL}/payment`,
  countries: `${baseURL}/countries`,
  patents: `${baseURL}/innovations/patents`,
  training: `${baseURL}/training`,
  batches: `${baseURL}/batch`,
  boards: `${baseURL}/boards`,
};
