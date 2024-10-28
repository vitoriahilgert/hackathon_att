import { api } from "./api";

const transcribe = async (data: any) => {
  const response = await api.post("/transcribe", data);
  return response.data;
};

const analyze = async (text: string) => {
  const response = await api.post("/analyze", { text }); // Envia o campo "text" com o valor
  return response.data;
};

const return_inavaliables = async (data: any) => {
  const response = await api.post("/return_inavaliables", data);
  return response.data;
};

export { transcribe, analyze, return_inavaliables};