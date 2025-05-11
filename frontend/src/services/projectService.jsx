import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get the auth token
const authHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Project CRUD operations
export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/projects/`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProject = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/projects/${projectId}/`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_URL}/api/projects/`, projectData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await axios.patch(`${API_URL}/api/projects/${projectId}/`, projectData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Timeline events
export const getProjectTimeline = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/project-timeline/`, {
      params: { project_id: projectId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createTimelineEvent = async (timelineData) => {
  try {
    const response = await axios.post(`${API_URL}/api/project-timeline/`, timelineData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTimelineEvent = async (eventId, eventData) => {
  try {
    const response = await axios.patch(`${API_URL}/api/project-timeline/${eventId}/`, eventData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Project workers
export const getProjectWorkers = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/project-workers/`, {
      params: { project_id: projectId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addWorkerByEmail = async (projectId, email, roleDescription = '') => {
  try {
    const response = await axios.post(`${API_URL}/api/projects/${projectId}/add_worker/`, {
      email,
      role_description: roleDescription
    }, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeWorker = async (workerId) => {
  try {
    await axios.delete(`${API_URL}/api/project-workers/${workerId}/`, {
      headers: authHeader()
    });
    return true;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Project suppliers
export const getProjectSuppliers = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/project-suppliers/`, {
      params: { project_id: projectId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createSupplier = async (supplierData) => {
  try {
    const response = await axios.post(`${API_URL}/api/project-suppliers/`, supplierData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Risk analysis
export const getProjectRisks = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/project-risks/`, {
      params: { project_id: projectId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createRisk = async (riskData) => {
  try {
    const response = await axios.post(`${API_URL}/api/project-risks/`, riskData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Chat operations
export const getChatRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/chat-rooms/`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMessages = async (chatRoomId) => {
  try {
    const response = await axios.get(`${API_URL}/api/messages/`, {
      params: { chat_room_id: chatRoomId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendMessage = async (chatRoomId, content, isUpdate = false) => {
  try {
    const response = await axios.post(`${API_URL}/api/messages/`, {
      chat_room_id: chatRoomId,
      content,
      is_update: isUpdate
    }, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Updates
export const getProjectUpdates = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/api/project-updates/`, {
      params: { project_id: projectId },
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};