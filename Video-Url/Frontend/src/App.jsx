import React, { useState } from "react";
import axios from "axios";

const UrlGeneratorPage = () => {
  const [form, setForm] = useState({
    companyName: "",
    productName: "",
  });

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setError("Please select a video.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("companyName", form.companyName);
      formData.append("productName", form.productName);
      formData.append("video", video);

      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
      );

      // Backend generated URL
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          URL Generator
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Fill details to generate your custom URL.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Company */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Company Name
            </label>

            <input
              id="companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Product */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Product
            </label>

            <input
              id="productName"
              name="productName"
              type="text"
              value={form.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Video */}
          <div>
            <label
              htmlFor="video"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Video
            </label>

            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm cursor-pointer"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate URL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UrlGeneratorPage;
