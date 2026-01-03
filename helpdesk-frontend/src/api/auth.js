import { http } from "./http";

export const authApi = {
  register: (payload) => http.post("/api/auth/register", payload).then(r => r.data),
  login: (payload) => http.post("/api/auth/login", payload).then(r => r.data),
  me: () => http.get("/api/auth/me").then(r => r.data),
};
