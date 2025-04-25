import axios from "axios";

// Correct usage of environment variable
const apiURl = import.meta.env.VITE_BACKEND_URI;

export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiURl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // If response has no content (204 or 404), don't parse as JSON
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text}`);
    }

    const resultText = await response.text();

    if (!resultText) {
      throw new Error("Empty response from server");
    }

    const result = JSON.parse(resultText);
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const { data } = await axios.get(apiURl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error);
    throw error;
  }
};

export const putData = async (url, formData, config = {}) => {
  try {
    // Validate input
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data format");
    }

    // Configure request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // Merge headers properly, ensuring config headers don't override Authorization
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      ...(config.headers || {}),
    };

    // Don't manually set Content-Type for FormData, let the browser set it with the boundary
    delete headers["Content-Type"];

    const response = await fetch(apiURl + url, {
      method: "PUT",
      headers,
      body: formData,
      signal: controller.signal,
      credentials: "include", // Include cookies if any
      ...config,
      headers, // Override any headers in config spread to ensure our headers take precedence
    });

    clearTimeout(timeoutId);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      // Log the full error details
      console.error("Server error:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });

      throw new Error(
        typeof responseData === "object"
          ? responseData.message ||
            `Request failed with status ${response.status}`
          : responseData || `Request failed with status ${response.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("PUT request error:", {
      message: error.message,
      url,
      errorType: error.name,
      stack: error.stack,
    });

    // Handle specific errors
    const errorMessage =
      error.name === "AbortError"
        ? "Request timed out"
        : error.message.includes("Network Error")
        ? "Network connection failed"
        : error.message || "File upload failed";

    throw new Error(`${errorMessage} (${url})`);
  }
};
