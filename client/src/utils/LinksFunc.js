// utils.js
import api from "./api";
import { LINKS_PAGE_LIMIT } from "../constants/constants";

export const createLink = async (linkData) => {
  const response = await api.post("/links", linkData, {
    withCredentials: true, 
  });
  return response.data;
};

export const fetchLinks = async (  category, tags, favorite = false, search = '', pageParam=1, limit=LINKS_PAGE_LIMIT, ) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (tags) params.append("tags", tags);
  if (favorite) params.append("favorite", true);
  if (search) params.set('search', search);

  params.append("page", pageParam);
  params.append("limit", limit);

  const res = await api.get(`/links?${params.toString()}`);
  return res.data;
};

export const deletelink = async (id) => {
  const response = await api.delete(`/links/${id}`);
  return response.data;
};

export const updateLink= async (data) => {
  const response = await api.put(`/links/${data.id}`, data.data, {
    withCredentials: true, 
  });
  return response.data;
};

export const favoriteLink= async (id) => {
  const response = await api.patch(`/links/${id}`,  {
    withCredentials: true, 
  });
  return response.data;
};
