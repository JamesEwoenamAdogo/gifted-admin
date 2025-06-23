import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import { useLocation } from "react-router-dom";


export default function CourseDetailsPage() {
  const location = useLocation()
  const courseDetails = JSON.parse(localStorage.getItem("courseDetails"))
  console.log(courseDetails)
  
  const course = {
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
        videoLinks: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        files: ["BudgetingGuide.pdf"],
        images: ["https://via.placeholder.com/150"],
      },
    ],
  };

  const convertToEmbedUrl = (url) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-blue-50 min-h-screen">
      <div className="space-y-2">
        <button className="text-sm text-gray-600 hover:underline">&larr; Dashboard</button>
        <h1 className="text-3xl font-bold">{courseDetails.title}</h1>
        <p className="text-gray-700">{courseDetails.description}</p>
      </div>

      

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Learning Modules</h2>
        {/* {courseDetails.map((mod, idx) => ( */}
          <div
            // key={idx}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-semibold text-lg">{courseDetails.title}</h3>
                  {/* <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {mod.level}
                  </span> */}
                </div>
                <p className="text-sm text-gray-600">{courseDetails.description}</p>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  {/* <span>&#9658; {mod.type}</span> */}
                  <span>&#8226;</span>
                  <span>{courseDetails.duration}</span>
                </div>
              </div>
            </div>

            {/* Embedded Videos */}
            {courseDetails.Videos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Videos</h4>
                {courseDetails.Videos.map((url, vIdx) => (
                  <iframe
                    key={vIdx}
                    src={convertToEmbedUrl(url)}
                    className="w-full aspect-video rounded border"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            )}

            {/* Attached Files */}
            {courseDetails.files.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Files</h4>
                <ul className="space-y-1">
                  {courseDetails.files.map((file, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-blue-700">
                      <FileText size={16} /> <a href={`#`} className="hover:underline">{file}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            {/* {courseDetails.image.length > 0 && ( */}
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Images</h4>
                <div className="flex flex-wrap gap-4">
                  {/* {courseDetails.image.map((src, iIdx) => ( */}
                    <img
                    //   key={iIdx}
                      src={courseDetails.image}
                      alt="Module Image"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  {/* ))} */}
                </div>
              </div>
            {/* )} */}

            <div className="text-right">
              <button className="border border-green-500 text-green-600 px-4 py-1 rounded hover:bg-green-50">
                Review
              </button>
            </div>
          </div>
        {/* ))} */}
      </div>
    </div>
  );
}
