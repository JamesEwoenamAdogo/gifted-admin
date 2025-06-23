import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditCompetition() {
  const navigate = useNavigate();
  const [competition, setCompetition] = useState({
    name: "",
    startDate: "",
    EndDate: "",
    materialCost:0,
    assessmentCost:0,
    Description:"",
    customizableButton:"",
    link:""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("editCompetition"));
    if (!data) {
      alert("No competition data found!");
      return navigate("/app/leads"); // fallback if accessed directly
    }
    setCompetition(data);
  }, [competition]);

  const handleChange = (e) => {
    setCompetition({ ...competition, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update-competition/${competition._id}`, competition);
      alert("Competition updated successfully");
      navigate("/app/leads");
    } catch (err) {
      console.error(err);
      alert("Failed to update competition");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Competition</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={competition.name}
          onChange={handleChange}
          placeholder="Name"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="Description"
          value={competition.Description}
          onChange={handleChange}
          placeholder="Name"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="customizableButton"
          value={competition.customizableButton}
          onChange={handleChange}
          placeholder="Name"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="link"
          value={competition.link}
          onChange={handleChange}
          placeholder="link"
          className="input input-bordered w-full"
        />
        <input
          type="date"
          name="startDate"
          value={competition.startDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="date"
          name="EndDate"
          value={competition.EndDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          name="materialCost"
          value={competition.materialCost}
          onChange={handleChange}
          placeholder="Cost"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          name="assessmentCost"
          value={competition.assessmentCost}
          onChange={handleChange}
          placeholder="Cost"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
