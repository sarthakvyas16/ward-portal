
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const API_URL = `${BASE_URL}/api/development`;
const MEDIA_URL = `${BASE_URL}/api/media`;

// Get admin token
function getToken() {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("Admin login required. Please login again.");
  }

  return token;
}

// Handle API responses
async function handleResponse(response) {
  const result = await response.json();

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("admin_token");
    throw new Error("Admin session expired. Please login again.");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// Public: Fetch published projects
export async function getDevelopmentProjects() {
  const response = await fetch(API_URL);
  const result = await handleResponse(response);

  return result.projects;
}

// Admin: Fetch all projects
export async function getAdminDevelopmentProjects() {
  const response = await fetch(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await handleResponse(response);
  return result.projects;
}

// Upload photo/video to Cloudinary via backend
export async function uploadDevelopmentMedia(file) {
  const token = getToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${MEDIA_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await handleResponse(response);
  return result.media;
}

// Admin: Create project
export async function createDevelopmentProject(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(response);
  return result.project;
}

// Admin: Update project
export async function updateDevelopmentProject(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(response);
  return result.project;
}

// Admin: Delete project
export async function deleteDevelopmentProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}

// Admin: Delete media from Cloudinary
export async function deleteDevelopmentMedia(publicId, resourceType) {
  const response = await fetch(`${MEDIA_URL}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ publicId, resourceType }),
  });

  return handleResponse(response);
}
