// utils/api.js
import api from "./api";
export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/categories", data, {
    withCredentials: true, 
  });
  return response.data;
};

export const updateCategory = async (data) => {
  const response = await api.put(`/categories/${data.id}`, {name:data.name }, {
    withCredentials: true, 
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
