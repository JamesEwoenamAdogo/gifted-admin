"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FileText, Filter, Download, RefreshCw } from "lucide-react"
import axios from "axios"

// Brand colors (matching existing components)
const brandColors = {
  primary: "#003366",
  secondary: "#336699",
  accent: "#6699CC",
  background: "#F0F4F8",
  text: "#333333",
  white: "#FFFFFF"
}

export default function ExamReportsPage() {
  const [activeTab, setActiveTab] = useState("reports")
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState("")
  const [examReports, setExamReports] = useState([])
  const [userLists, setUserLists] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingExams, setIsLoadingExams] = useState(true)
  const [error, setError] = useState("")

  // Removed mock examReports; now populated from API

  const mockUserLists = [
    { name: "John Smith", email: "john.smith@email.com", school: "Lincoln High School", grade: "10", startTime: "2024-01-15 09:00", status: "Completed" },
    { name: "Sarah Johnson", email: "sarah.j@email.com", school: "Washington Middle School", grade: "9", startTime: "2024-01-15 09:15", status: "Completed" },
    { name: "Michael Brown", email: "mike.brown@email.com", school: "Roosevelt High School", grade: "11", startTime: "2024-01-15 09:30", status: "In Progress" },
    { name: "Emily Davis", email: "emily.davis@email.com", school: "Jefferson Elementary", grade: "8", startTime: "2024-01-15 09:45", status: "Completed" },
    { name: "David Wilson", email: "david.w@email.com", school: "Kennedy High School", grade: "12", startTime: "2024-01-15 10:00", status: "Not Started" },
    { name: "Lisa Anderson", email: "lisa.a@email.com", school: "Madison Middle School", grade: "9", startTime: "2024-01-15 10:15", status: "Completed" },
    { name: "Robert Taylor", email: "robert.t@email.com", school: "Adams High School", grade: "10", startTime: "2024-01-15 10:30", status: "In Progress" },
    { name: "Jennifer Martinez", email: "jennifer.m@email.com", school: "Jackson Elementary", grade: "8", startTime: "2024-01-15 10:45", status: "Completed" }
  ]

  // Fetch exams on component mount
  useEffect(() => {
    fetchExams()
  }, [])

  // Fetch exam data when selected exam changes
  useEffect(() => {
    if (selectedExam) {
      fetchExamData()
    }
  }, [selectedExam])

  const fetchExams = async () => {
    try {
      setIsLoadingExams(true)
      const response = await axios.get("/fetch-exam-mode")
      
      if (response.data && response.data.exams) {
        setExams(response.data.exams)
        if (response.data.exams.length > 0) {
          setSelectedExam(response.data.exams[0]._id)
        }
      } else {
        setError("No exams found")
      }
    } catch (error) {
      console.error("Error fetching exams:", error)
      setError("Failed to fetch exams. Please try again.")
    } finally {
      setIsLoadingExams(false)
    }
  }

  const fetchExamData = async () => {
    if (!selectedExam) return

    try {
      setIsLoading(true)
      setError("")

      const recordsResponse = await axios.get(`/fetch-exam-records/${encodeURIComponent(selectedExam)}`)
      const records = recordsResponse?.data?.examRecords || []
      setExamReports(records)
      setUserLists(mockUserLists)
    } catch (error) {
      console.error("Error fetching exam data:", error)
      setError("Failed to fetch exam data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    if (selectedExam) {
      fetchExamData()
    }
  }

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    const headers = activeTab === "reports" 
      ? ["Name", "School", "Grade", "Score"]
      : ["Name", "Email", "School", "Grade", "Start Time", "Status"]

    const csvContent = [
      headers.join(","),
      ...data.map(item => {
        if (activeTab === "reports") {
          return [
            `"${item.name || ""}"`,
            `"${item.school || ""}"`,
            `"${item.grade || ""}"`,
            `"${item.score || ""}"`
          ].join(",")
        } else {
          return [
            `"${item.name || ""}"`,
            `"${item.email || ""}"`,
            `"${item.school || ""}"`,
            `"${item.grade || ""}"`,
            `"${item.startTime || ""}"`,
            `"${item.status || ""}"`
          ].join(",")
        }
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen w-full overflow-auto" style={{ backgroundColor: brandColors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div
            className="inline-block mb-3 rounded-full px-4 py-1 text-sm font-medium"
            style={{ backgroundColor: `${brandColors.accent}30`, color: brandColors.primary }}
          >
            Exam Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: brandColors.primary }}>
            Exam Reports & User Management
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: brandColors.secondary }}>
            View exam reports and manage users for your exams
          </p>
        </motion.div>

        {/* Exam Filter */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter size={24} style={{ color: brandColors.primary }} />
              <h2 className="text-xl font-semibold" style={{ color: brandColors.primary }}>
                Select Exam
              </h2>
            </div>
            
            {isLoadingExams ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="animate-spin mr-2" size={20} />
                <span style={{ color: brandColors.secondary }}>Loading exams...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: `${brandColors.secondary}30`,
                      backgroundColor: brandColors.white,
                    }}
                  >
                    <option value="">Select an exam...</option>
                    {exams.map((exam, index) => (
                      <option key={index} value={exam._id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={!selectedExam || isLoading}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: brandColors.accent,
                    color: brandColors.white,
                  }}
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  {isLoading ? "Loading..." : "Refresh"}
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg"
                style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <span className="text-sm" style={{ color: "#dc2626" }}>
                  {error}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b" style={{ borderColor: `${brandColors.secondary}20` }}>
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "reports"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor: activeTab === "reports" ? brandColors.primary : "transparent",
                }}
              >
                <FileText size={20} />
                Exam Reports
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "users"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor: activeTab === "users" ? brandColors.primary : "transparent",
                }}
              >
                <Users size={20} />
                User Lists
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {!selectedExam ? (
                <div className="text-center py-12">
                  <div
                    className="inline-block p-4 rounded-full mb-4"
                    style={{ backgroundColor: `${brandColors.accent}20` }}
                  >
                    <Filter size={48} style={{ color: brandColors.accent }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: brandColors.primary }}>
                    Select an Exam
                  </h3>
                  <p style={{ color: brandColors.secondary }}>
                    Choose an exam from the dropdown above to view reports and user data
                  </p>
                </div>
              ) : (
                <>
                  {/* Exam Reports Tab */}
                  {activeTab === "reports" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold" style={{ color: brandColors.primary }}>
                          Exam Reports - {exams.find((e) => e._id === selectedExam)?.title || ""}
                        </h3>
                        <button
                          onClick={() => exportToCSV(examReports, "exam_reports")}
                          disabled={examReports.length === 0}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: brandColors.accent,
                            color: brandColors.white,
                          }}
                        >
                          <Download size={16} />
                          Export CSV
                        </button>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <RefreshCw className="animate-spin mr-2" size={24} />
                          <span style={{ color: brandColors.secondary }}>Loading reports...</span>
                        </div>
                      ) : examReports.length === 0 ? (
                        <div className="text-center py-12">
                          <div
                            className="inline-block p-4 rounded-full mb-4"
                            style={{ backgroundColor: `${brandColors.accent}20` }}
                          >
                            <FileText size={48} style={{ color: brandColors.accent }} />
                          </div>
                          <h4 className="text-lg font-semibold mb-2" style={{ color: brandColors.primary }}>
                            No Reports Available
                          </h4>
                          <p style={{ color: brandColors.secondary }}>
                            No exam reports found for this exam. Reports will appear here once students complete the exam.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr style={{ backgroundColor: `${brandColors.primary}10` }}>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  School
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Grade
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Score
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {examReports.map((report, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50 transition-colors"
                                  style={{ borderColor: `${brandColors.secondary}20` }}
                                >
                                  <td className="px-4 py-3 font-medium">{report.name || "N/A"}</td>
                                  <td className="px-4 py-3">{report.school || "N/A"}</td>
                                  <td className="px-4 py-3">{report.grade || "N/A"}</td>
                                  <td className="px-4 py-3 font-semibold" style={{ color: brandColors.primary }}>
                                    {report.score || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* User Lists Tab */}
                  {activeTab === "users" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold" style={{ color: brandColors.primary }}>
                          User Lists - {selectedExam}
                        </h3>
                        <button
                          onClick={() => exportToCSV(userLists, "user_lists")}
                          disabled={userLists.length === 0}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: brandColors.accent,
                            color: brandColors.white,
                          }}
                        >
                          <Download size={16} />
                          Export CSV
                        </button>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <RefreshCw className="animate-spin mr-2" size={24} />
                          <span style={{ color: brandColors.secondary }}>Loading users...</span>
                        </div>
                      ) : userLists.length === 0 ? (
                        <div className="text-center py-12">
                          <div
                            className="inline-block p-4 rounded-full mb-4"
                            style={{ backgroundColor: `${brandColors.accent}20` }}
                          >
                            <Users size={48} style={{ color: brandColors.accent }} />
                          </div>
                          <h4 className="text-lg font-semibold mb-2" style={{ color: brandColors.primary }}>
                            No Users Found
                          </h4>
                          <p style={{ color: brandColors.secondary }}>
                            No users have registered for this exam yet. Users will appear here once they sign up.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr style={{ backgroundColor: `${brandColors.primary}10` }}>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Email
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  School
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Grade
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Start Time
                                </th>
                                <th className="px-4 py-3 text-left font-semibold" style={{ color: brandColors.primary }}>
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {userLists.map((user, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50 transition-colors"
                                  style={{ borderColor: `${brandColors.secondary}20` }}
                                >
                                  <td className="px-4 py-3 font-medium">{user.name || "N/A"}</td>
                                  <td className="px-4 py-3">{user.email || "N/A"}</td>
                                  <td className="px-4 py-3">{user.school || "N/A"}</td>
                                  <td className="px-4 py-3">{user.grade || "N/A"}</td>
                                  <td className="px-4 py-3">{user.startTime || "N/A"}</td>
                                  <td className="px-4 py-3">
                                    <span
                                      className="px-2 py-1 rounded-full text-xs font-medium"
                                      style={{
                                        backgroundColor: user.status === "Active" ? "#d1fae5" : "#fef3c7",
                                        color: user.status === "Active" ? "#065f46" : "#92400e",
                                      }}
                                    >
                                      {user.status || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
