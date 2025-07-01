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
    materialCost: 0,
    assessmentCost: 0,
    Description: "",
    customizableButton: "",
    link: ""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("editCompetition"));
    if (!data) {
      alert("No competition data found!");
      // return navigate("/app/edit-competio");
    }
    setCompetition(data);
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
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
