import axios from "axios";

export const API_ENDPOINT = process.env.NEXT_PUBLIC_APP_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  // withCredentials: true,
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*',
  // }
});
