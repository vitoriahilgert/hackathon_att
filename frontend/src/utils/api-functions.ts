import { api } from "./api";

const transcribe = async (data: any) => {
  const response = await api.post("/transcribe", data);
  return response.data;
};

const analyze = async (data: any) => {
  const response = await api.post("/analyze", data);
  return response.data;
};

const return_inavaliables = async (data: any) => {
  const response = await api.post("/return_inavaliables", data);
  return response.data;
};

export { transcribe, analyze, return_inavaliables };
