import React, { useState } from "react";
import { previewUrl, saveUrl } from "./service";

const UrlGeneratorPage = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    video: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedUrl, setSavedUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Preview
  const handlePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreview(null);
    setSavedUrl(null);

    try {
      const res = await previewUrl(form);
      setPreview(res);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Final Save
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await saveUrl(form);
      setSavedUrl(res.url);
      setPreview(null); // preview hata do
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
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

        <form onSubmit={handlePreview} className="space-y-5 mt-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="Enter company name"
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
            <select
              // id="video"
              name="video"
              value={form.video}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="" disabled>
                Select video
              </option>
              <option value="wazzuppapdemo">WazzupPAP Demo</option>
              <option value="rxpl">RxPL</option>
              <option value="ludoRx3">Ludo Rx3</option>
              <option value="soccer">Soccer</option>
              <option value="RxPL-Demo">RxPL Demo</option>
              <option value="DocTalkQuiz">DocTalk Quiz</option>
            </select>
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

        {/* Preview Section */}
        {preview && !savedUrl && (
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h3 className="font-semibold text-slate-800">Preview</h3>
            <p className="text-sm text-slate-600">
              URL:{" "}
              <span className="font-medium text-blue-600">{preview.url}</span>
            </p>
            <p className="text-sm text-slate-600">Path: {preview.newPath}</p>

            <pre className="text-xs bg-slate-100 p-3 rounded border border-slate-200 overflow-auto">
              {preview.newBlock}
            </pre>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        )}

        {/* Success */}
        {savedUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-800 font-medium">URL Generated!</p>
            <a
              href={savedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline mt-1 inline-block"
            >
              {savedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlGeneratorPage;
