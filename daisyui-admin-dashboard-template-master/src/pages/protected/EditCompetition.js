import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditCompetition() {
  const navigate = useNavigate();
  const [competition, setCompetition] = useState({
    _id: "",
    name: "",
    startDate: "",
    EndDate: "",
    competitionCost:0,
    materialCost: 0,
    assessmentCost: 0,
    Description: "",
    customizableButton: "",
    link: "",
    grade: []
  });
  const [isEditingGrades, setIsEditingGrades] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("editCompetition"));
    if (!data) {
      alert("No competition data found!");
      // return navigate("/app/edit-competio");
    }
    setCompetition({
      grade: [],
      ...data,
      grade: Array.isArray(data?.grade)
        ? data.grade.map((g) => String(g))
        : []
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCompetition({
      ...competition,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update-competition/${competition._id}`, competition);
      alert("Competition updated successfully");
      navigate("/app/competitions");
    } catch (err) {
      console.error(err);
      alert("Failed to update competition");
    }
  };

  const handleGradeToggle = (e) => {
    const selectedGrade = String(e.target.value);
    const isChecked = e.target.checked;
    setCompetition((prev) => {
      const current = Array.isArray(prev.grade) ? prev.grade.map((g) => String(g)) : [];
      if (isChecked) {
        if (current.includes(selectedGrade)) return prev;
        return { ...prev, grade: [...current, selectedGrade].sort((a, b) => Number(a) - Number(b)) };
      }
      return { ...prev, grade: current.filter((g) => String(g) !== selectedGrade) };
    });
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Competition</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
       <label><h1 className="font-semibold">Competition</h1></label>
        <input
          type="text"
          name="name"
          value={competition.name}
          onChange={handleChange}
          placeholder="Competition Name"
          className="input input-bordered w-full"
        />
       <label><h1 className="font-semibold">Description</h1></label>

        <textarea
          name="Description"
          value={competition.Description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />
       <label><h1 className="font-semibold">Customizable Button</h1></label>

        <input
          type="text"
          name="customizableButton"
          value={competition.customizableButton}
          onChange={handleChange}
          placeholder="Button Text"
          className="input input-bordered w-full"
        />
       <label><h1 className="font-semibold">Link</h1></label>

        <input
          type="text"
          name="link"
          value={competition.link}
          onChange={handleChange}
          placeholder="Link"
          className="input input-bordered w-full"
        />
       <label><h1 className="font-semibold">Start Date</h1></label>

        <input
          type="date"
          name="startDate"
          value={competition.startDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
       <label><h1 className="font-semibold">End Date</h1></label>

        <input
          type="date"
          name="EndDate"
          value={competition.EndDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
         <label><h1 className="font-semibold">Competition Cost</h1></label>

        <input
          type="number"
          name="materialCost"
          value={competition.competitionCost}
          onChange={handleChange}
          placeholder="Material Cost"
          className="input input-bordered w-full"
        />
       <label><h1 className="font-semibold">Material Cost</h1></label>

        <input
          type="number"
          name="materialCost"
          value={competition.materialCost}
          onChange={handleChange}
          placeholder="Material Cost"
          className="input input-bordered w-full"
        />
      
       <label><h1 className="font-semibold">Assessment Cost</h1></label>

        <input
          type="number"
          name="assessmentCost"
          value={competition.assessmentCost}
          onChange={handleChange}
          placeholder="Assessment Cost"
          className="input input-bordered w-full"
        />
       <div>
         <label><h1 className="font-semibold">Grades</h1></label>
         <div className="flex items-center justify-between">
           <div className="text-sm">
             {competition.grade && competition.grade.length > 0 ? competition.grade.join(", ") : "None selected"}
           </div>
           <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditingGrades((v) => !v)}>
             {isEditingGrades ? "Done" : "Edit Grades"}
           </button>
         </div>
         {isEditingGrades && (
           <div className="mt-2 p-3 border rounded-lg max-h-56 overflow-auto bg-base-100">
             <div className="grid grid-cols-3 gap-2">
               {gradeOptions.map((g) => (
                 <label key={g} className="label cursor-pointer justify-start gap-2">
                   <input
                     type="checkbox"
                     className="checkbox checkbox-sm"
                    value={g}
                    checked={Array.isArray(competition.grade) ? competition.grade.map((x) => String(x)).includes(g) : false}
                     onChange={handleGradeToggle}
                   />
                  <span className="label-text">{g}</span>
                 </label>
               ))}
             </div>
           </div>
         )}
       </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
