import api from "./api";

export const fetchTags = async () => {
  const response = await api.get('/tags');
  return response.data;
};

export const createTag = async (data) => {
  const response = await api.post("/tags", data, {
    withCredentials: true, 
  });
  return response.data;
};

export const updateTag = async (data) => {
  const response = await api.put(`/tags/${data.id}`, {name:data.name }, {
    withCredentials: true, 
  });
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};
