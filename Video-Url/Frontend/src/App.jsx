import React, { useState } from "react";

const UrlGeneratorPage = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    video: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Preview
  const handlePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

  };

  // Step 2: Final Save
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

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

        <form onSubmit={handlePreview} className="space-y-5 mt-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Company Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Company name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Product
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
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
              type="file"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate URL"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlGeneratorPage;
