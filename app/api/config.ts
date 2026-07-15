import axios from "axios";
import { serverConstants } from "./serverConstant";

const createPublicUrl = (baseURL: string) => axios.create({ baseURL });
const createSecuredUrl = (baseURL: string) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

const userSecuredApi = createSecuredUrl(serverConstants.users);
const userPublicApi = createPublicUrl(serverConstants.users);
const basePublicApi = createPublicUrl(serverConstants.base);
const authApi = createSecuredUrl(serverConstants.auth);
const plansApi = createSecuredUrl(serverConstants.plans);
const paymentSecuredApi = createSecuredUrl(serverConstants.payment);
const countriesApi = createSecuredUrl(serverConstants.countries);
const patentsApi = createSecuredUrl(serverConstants.patents);
const trainingApi = createSecuredUrl(serverConstants.training);
const batchesApi = createSecuredUrl(serverConstants.batches);
const boardsApi = createSecuredUrl(serverConstants.boards);
const innovationAPI = createSecuredUrl(serverConstants.innovations);
const resourcesAPI = createSecuredUrl(serverConstants.resources);
const researchAPI = createSecuredUrl(serverConstants.research);
const startupsApi = createSecuredUrl(serverConstants.startups);

export {
  userPublicApi,
  userSecuredApi,
  authApi,
  basePublicApi,
  plansApi,
  paymentSecuredApi,
  countriesApi,
  patentsApi,
  trainingApi,
  batchesApi,
  boardsApi,
  innovationAPI,
  resourcesAPI,
  researchAPI,
  startupsApi,
};
