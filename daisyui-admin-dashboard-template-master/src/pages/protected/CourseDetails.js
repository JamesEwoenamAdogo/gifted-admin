import React, {useState,useEffect} from "react";
import { CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios"
// import {useNavigate} from "react-router"

export default function CourseDetailsPage() {
  // const location = useLocation()
  const courseData = localStorage.getItem("courseInfo")
  const { files, title, grade, category, level,description ,duration} = JSON.parse(courseData);
  const [course,setCourse] = useState([])
  // const navigate = useNavigate()

  const courses= {
    title: "Financial Literacy Mastery",
    description:
      "Build a comprehensive understanding of personal finance, from budgeting basics to advanced investment strategies.",
    completedModules: 3,
    totalModules: 8,
    estimatedTime: "4-6 weeks",
    progress: 38,
    modules: [
      {
        title: "Budgeting Fundamentals",
        level: "beginner",
        description: "Learn to create and maintain a personal budget",
        type: "Video",
        duration: "15 min",
        completed: true,
      },
      // Add more modules here if needed
    ],
  };
  useEffect(()=>{
    const loadCourseDetails= async()=>{
      const response = await axios.get(`/fetch-course-details/${JSON.parse(courseData)._id}`)
      console.log(response)
      setCourse(response.data.course)
      console.log(course)
    }
    loadCourseDetails()
  },[])

  return (
    <div className="mx-auto p-6 space-y-6 bg-blue-50 min-h-screen w-[80%]">
      {/* Header */}
      <div className="space-y-2">
        <button className="text-sm text-gray-600 hover:underline">&larr; Dashboard</button>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-700">{description}</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl shadow p-6 text-center gap-4">
        <div>
          <p className="text-3xl font-bold text-purple-600">{course.progress}%</p>
          <p className="text-sm text-gray-500">Complete</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{course.completedModules}/{course.totalModules}</p>
          <p className="text-sm text-gray-500">Modules</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{duration}</p>
          <p className="text-sm text-gray-500">Estimated Time</p>
        </div>
        <div className="col-span-full">
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-purple-700 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Learning Modules</h2>
        {course.map((mod, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-semibold text-lg">{mod.title}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {/* {mod.level} */}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{mod.description}</p>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  {/* <span>&#9658; {mod.type}</span> */}
                  <span>&#8226;</span>
                  <span>{mod.duration}</span>
                </div>
              </div>
            </div>
            <button className="border border-green-500 text-green-600 px-4 py-1 rounded hover:bg-green-50" onClick={()=>{localStorage.setItem("courseDetails",JSON.stringify(mod));window.location.href="/app/single-course"}} >
              Review
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
