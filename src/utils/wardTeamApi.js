
const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_URL}/api/ward-team`;
const AUTH_URL = `${BASE_URL}/api/auth/login`;

// Admin Login API
export async function loginAdmin(username, password) {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Login failed");
  }

  localStorage.setItem("admin_token", result.token);
  return result;
}

// Public Ward Team Fetch
export async function getWardTeam() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Ward Team load nahi hui");
    }

    return result.data;
  } catch (error) {
    console.error("Ward Team Fetch Error:", error);
    throw error;
  }
}

// Admin Ward Team Save
export async function saveWardTeam(data) {
  const token = localStorage.getItem("admin_token");

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });

  const result = await response.json();

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("admin_token");
    throw new Error("Admin session expired. Please login again.");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Ward Team save nahi hui");
  }

  return result.data;
}
