const API_BASE_URL = "http://localhost:4000/api";

export const loginAPI = `${API_BASE_URL}/auth/login`;
export const registerAPI = `${API_BASE_URL}/auth/register`;
export const addTransactionAPI = `${API_BASE_URL}/v1/addTransaction`;
export const getTransactionAPI = `${API_BASE_URL}/v1/getTransaction`;
export const deleteTransactionAPI = (id) => `${API_BASE_URL}/v1/deleteTransaction/${id}`;
export const setAvatarAPI = `${API_BASE_URL}/auth/setAvatar`;
