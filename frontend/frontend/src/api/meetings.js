import { request } from "./request";

export function getAllMeetings() {
  return request("/meetings");
}

export function getMeetingById(id) {
  return request(`/meetings/${id}`);
}

export function getMeetingsByProject(projectId) {
  return request(`/project/${projectId}`);
}

export function createMeeting(projectId, meeting) {
  return request(`/projects/${projectId}/meetings`, { 
    method: "POST", 
    body: meeting 
  });
}

export function updateMeeting(id, updates) {
  return request(`/meetings/${id}`, { 
    method: "PUT", 
    body: updates 
  });
}

export function deleteMeeting(id) {
  return request(`/meetings/${id}`, { 
    method: "DELETE" 
  });
}
