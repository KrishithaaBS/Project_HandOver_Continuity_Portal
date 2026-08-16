import { request } from "./request";

export function getPendingRequests() {
    return request("/requests/pending");
}

export function getMyRequests() {
    return request("/requests/mine");
}

export function getRequestsForProject(projectId) {
    return request(`/projects/${projectId}/requests`);
}

export function createRequest(projectId, message) {
    return request(`/projects/${projectId}/requests`, {
        method: "POST",
        body: { message },
    });
}

export function updateRequest(id, { status, responseNotes }) {
    return request(`/requests/${id}`, {
        method: "PUT",
        body: { status, responseNotes } 
    });
}
