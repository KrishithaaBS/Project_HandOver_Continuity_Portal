import { request } from "./request";

export function signup({ username, email, password }) {
  return request("/auth/signup", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}
