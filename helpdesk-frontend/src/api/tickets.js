import { http } from "./http";

export const ticketsApi = {
  list: (params) => http.get("/api/tickets", { params }).then((r) => r.data),
  get: (id) => http.get(`/api/tickets/${id}`).then((r) => r.data),
  create: (payload) => http.post("/api/tickets", payload).then((r) => r.data),
  patch: (id, payload) => http.patch(`/api/tickets/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/api/tickets/${id}`).then((r) => r.data),

  updateStatus: (id, status) =>
    http.patch(`/api/tickets/${id}/status`, { status }).then((r) => r.data),

  dashboard: () => http.get("/api/tickets/dashboard").then((r) => r.data),
};
