export const setCookie = (name, value, days = 90) => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
};

export const getCookie = (name = "accessToken") => {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
};

export const deleteCookie = (name = "accessToken") => {
  setCookie(name, "", -1);
};
