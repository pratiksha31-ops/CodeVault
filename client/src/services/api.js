const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const api = {
  get: (endpoint) => {
    return request(endpoint);
  },

  post: (endpoint, body) => {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: (endpoint, body) => {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: (endpoint) => {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};

export { api };
export default api;