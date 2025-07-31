import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  withCredentials: true,
});

export default axiosClient;
