import axios from "axios";

// const API_URL = "http://localhost:8000";

// Preview — dryRun backend khud true kar dega
export const previewUrl = async ({ name, company, video }) => {
  const { data } = await axios.post("http://localhost:8000/api/generate-url", {
    name,
    company,
    video,
    // No dryRun needed here, backend will handle it automatically
  });
  return data;
};

export const saveUrl = async ({ name, company, video }) => {
  const { data } = await axios.post("http://localhost:8000/api/generate-url", {
    name,
    company,
    video,
    dryRun: false,
  });
  return data;
};
