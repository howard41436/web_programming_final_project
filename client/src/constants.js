import axios from "axios";

export const BASENAME = process.env.REACT_APP_BASENAME || "/";
export const PUBLIC_URL = (path) =>
  [BASENAME, path].join("/").replace(new RegExp("/{1,}", "g"), "/");

export const INSTANCE = axios.create({
  baseURL: process.env.REACT_APP_BASEURL || "http://localhost:4000",
});
