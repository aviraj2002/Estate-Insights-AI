import axios from "axios";

const BASE = "https://estate-insights-ai.onrender.com/api/";

export const uploadExcel = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/upload/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAreas = () => axios.get(`${BASE}/areas/`);

export const analyze = (primary, comparison) => {
  const params = { primary: primary || "", comparison: comparison || "" };
  return axios.get(`${BASE}/analyze/`, { params });
};

export const priceGrowth = (location, years = 3) => {
  return axios.get(`${BASE}/price-growth/`, { params: { location, years } });
};
