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
  innovations: `${baseURL}/innovations`,
  resources: `${baseURL}/resources`,
};

// const AuthenticationUrl = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_AUTHENTICATION_PORT}`;
// const userUrl = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_USER_MANAGEMENT_PORT}`;
// const planUrls = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_PLATFORM_MANAGEMENT_PORT}`;
// const platform = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_PLATFORM_MANAGEMENT_PORT}`;
// const payments = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_PLATFORM_MANAGEMENT_PORT}`;
// export const serverConstants = {
//   auth: `${AuthenticationUrl}/api/auth`,
//   users: `${userUrl}/api/user`,
//   plans: `${planUrls}/api/plans`,
//   base: `${platform}`,
//   payment: `${payments}/api/payment`,
//   countries: `${userUrl}/api/user`,
//   patents: `${platform}/api/innovations`,
// };
