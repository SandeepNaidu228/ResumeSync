const API_URL = "http://localhost:5000/api/resumes";

const getAuthHeaders = () => {
  const token = localStorage.getItem("resumesync_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getResumes = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch resumes.");
  }

  return data;
};

export const createResume = async (title = "Untitled Resume") => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create resume.");
  }

  return data;
};

export const deleteResume = async (resumeId) => {
  const response = await fetch(`${API_URL}/${resumeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete resume.");
  }

  return data;
};

export const getResumeById = async (resumeId) => {
  const response = await fetch(`${API_URL}/${resumeId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch resume.");
  }

  return data;
};

export const updateResume = async (resumeId, updates) => {
  const response = await fetch(`${API_URL}/${resumeId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update resume.");
  }

  return data;
};