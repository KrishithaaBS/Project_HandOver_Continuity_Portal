import { request } from "./request";

export function getAllProjects() {
    return request("/projects");
}

export function getMyProjects() {
    return request("/projects/mine");
}

export function getProjectById(id) {
    return request(`/projects/${id}`);
}

export function createProject(project) {
    return request("/projects", { 
        method: "POST", 
        body: project 
    });
}

export function updateProject(id, updates) {
    return request(`/projects/${id}`, { 
        method: "PUT", 
        body: updates 
    });
}

export function deleteProject(id) {
    return request(`/projects/${id}`, { 
        method: "DELETE" 
    });
}
