import axios from "axios";
import { serverConstants } from "./serverConstant";

const userSecuredApi = axios.create({
  baseURL: serverConstants.users,
});
userSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userPublicApi = axios.create({
  baseURL: serverConstants.users,
});

const basePublicApi = axios.create({
  baseURL: serverConstants.base,
});

const authApi = axios.create({
  baseURL: serverConstants.auth,
});

const plansApi = axios.create({
  baseURL: serverConstants.base,
});

plansApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const paymentSecuredApi = axios.create({
  baseURL: serverConstants.payment,
});

paymentSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const countriesApi = axios.create({
  baseURL: serverConstants.countries,
});

countriesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const patentsApi = axios.create({
  baseURL: serverConstants.patents,
});

patentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const trainingApi = axios.create({
  baseURL: serverConstants.training,
});

trainingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const batchesApi = axios.create({
  baseURL: serverConstants.batches,
});

batchesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
};
