import axios from "axios";

export const BASENAME = "/";
export const INSTANCE = axios.create({ baseURL: "http://localhost:4000" });
