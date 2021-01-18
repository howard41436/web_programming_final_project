import axios from "axios";

export const BASENAME = process.env.REACT_APP_BASENAME || "/";
export const PUBLIC_URL = (path) =>
  [BASENAME, path].join("/").replace(new RegExp("/{1,}", "g"), "/");

export const INSTANCE = axios.create({
  baseURL: process.env.REACT_APP_BASEURL || "http://localhost:4000",
});

export const AVATAR = {
  0: PUBLIC_URL("/img/boy.png"),
  1: PUBLIC_URL("/img/boy2.png"),
  2: PUBLIC_URL("/img/girl.png"),
  3: PUBLIC_URL("/img/girl2.png"),
  "00": PUBLIC_URL("/img/boy_boy.png"),
  "01": PUBLIC_URL("/img/boy_boy2.png"),
  "02": PUBLIC_URL("/img/boy_girl.png"),
  "03": PUBLIC_URL("/img/boy_girl2.png"),
  10: PUBLIC_URL("/img/boy2_boy.png"),
  11: PUBLIC_URL("/img/boy2_boy2.png"),
  12: PUBLIC_URL("/img/boy2_girl.png"),
  13: PUBLIC_URL("/img/boy2_girl2.png"),
  20: PUBLIC_URL("/img/girl_boy.png"),
  21: PUBLIC_URL("/img/girl_boy2.png"),
  22: PUBLIC_URL("/img/girl_girl.png"),
  23: PUBLIC_URL("/img/girl_girl2.png"),
  30: PUBLIC_URL("/img/girl2_boy.png"),
  31: PUBLIC_URL("/img/girl2_boy2.png"),
  32: PUBLIC_URL("/img/girl2_girl.png"),
  33: PUBLIC_URL("/img/girl2_girl2.png"),
};
