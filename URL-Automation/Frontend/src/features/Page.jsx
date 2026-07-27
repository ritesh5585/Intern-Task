import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    userName: '',
    companyName: '',
    selectedOption: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic can be connected here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            URL Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to generate your custom URL.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. User's Name */}
          <div>
            <label 
              htmlFor="userName" 
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              User's Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter user's name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* 2. Company Name */}
          <div>
            <label 
              htmlFor="companyName" 
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* 3. Option Dropdown */}
          <div>
            <label 
              htmlFor="selectedOption" 
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Select Option
            </label>
            <select
              id="selectedOption"
              name="selectedOption"
              value={formData.selectedOption}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="" disabled>Select an option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Generate URL Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:bg-blue-800"
            >
              Generate URL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page