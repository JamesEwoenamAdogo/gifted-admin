import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";
import axios from "axios";

const INITIAL_LEAD_OBJ = {
    name: "",
    startDate: "",
    EndDate: "",
    competitionCost: "",
    materialCost: "",
    assessmentCost: "",
    link: "",
    customizableButton: "",
    Description:"",
};

function AddLeadModalBody({ closeModal, competitionToEdit }) {
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const typeOptions = ["Mathematics", "Science", "English", "ICT", "Geography"];
    const [type, setType] = useState([]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    useEffect(() => {
        if (competitionToEdit) {
            setLeadObj({
                name: competitionToEdit.name || "",
                startDate: competitionToEdit.startDate || "",
                EndDate: competitionToEdit.EndDate || "",
                cost: competitionToEdit.cost || "",
                materialCost: competitionToEdit.materialCost || "",
                assessmentCost: competitionToEdit.assessmentCost || "",
                link: competitionToEdit.link || "",
                customizableButton: competitionToEdit.customizableButton || ""
            });
            setType(competitionToEdit.type || []);
            setSelectedYear(competitionToEdit.year || currentYear);
        }
    }, [competitionToEdit]);

    const handleCheckboxChange = (option) => {
        setType((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const saveNewLead = async () => {
        const id = localStorage.getItem("id");

        if (!leadObj.name.trim()) return setErrorMessage("Name is required!");
        if (!leadObj.startDate.trim()) return setErrorMessage("Start Date required!");
        if (!leadObj.EndDate.trim()) return setErrorMessage("End Date required!");
        // if (!leadObj.cost.trim()) return setErrorMessage("Cost is required!");

        const newLeadObj = {
            ...leadObj,
            type,
            year: selectedYear,
            registered: competitionToEdit?.registered || [],
            paid: competitionToEdit?.paid || [],
            id
        };

        try {
            if (competitionToEdit?._id) {
                const response = await axios.put(`/edit-competition/${competitionToEdit._id}`, newLeadObj);
                if (response.data.success) {
                    dispatch(showNotification({ message: "Competition updated", status: 1 }));
                    closeModal();
                }
            } else {
                const response = await axios.post("/add-competition", newLeadObj);
                if (response.data.success) {
                    dispatch(addNewLead({ newLeadObj }));
                    dispatch(showNotification({ message: "New item added", status: 1 }));
                    closeModal();
                }
            }
        } catch (err) {
            setErrorMessage("Something went wrong!");
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLeadObj({ ...leadObj, [updateType]: value });
    };

    return (
        <>
            {localStorage.getItem("resources") ? (
                <InputText type="file" />
            ) : (
                <>
                    <InputText
                        type="text"
                        defaultValue={leadObj.name}
                        updateType="name"
                        containerStyle="mt-4"
                        labelTitle="Name"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Date"
                        defaultValue={leadObj.startDate}
                        updateType="startDate"
                        containerStyle="mt-4"
                        labelTitle="Start Date"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Date"
                        defaultValue={leadObj.EndDate}
                        updateType="EndDate"
                        containerStyle="mt-4"
                        labelTitle="End Date"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Text"
                        defaultValue={leadObj.Description}
                        updateType="Description"
                        containerStyle="mt-4"
                        labelTitle="Description"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Number"
                        defaultValue={leadObj.materialCost}
                        updateType="materialCost"
                        containerStyle="mt-4"
                        labelTitle="Course Materials Cost"
                        updateFormValue={updateFormValue}
                    />
                    <InputText
                        type="Number"
                        defaultValue={leadObj.competitionCost}
                        updateType="competitionCost"
                        containerStyle="mt-4"
                        labelTitle="Competition Cost"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Number"
                        defaultValue={leadObj.assessmentCost}
                        updateType="assessmentCost"
                        containerStyle="mt-4"
                        labelTitle="Assessment Cost"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Text"
                        defaultValue={leadObj.link}
                        updateType="link"
                        containerStyle="mt-4"
                        labelTitle="Link"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Text"
                        defaultValue={leadObj.customizableButton}
                        updateType="customizableButton"
                        containerStyle="mt-4"
                        labelTitle="Customizable Button"
                        updateFormValue={updateFormValue}
                    />

                    <label htmlFor="year" className="block mt-4 mb-2 font-semibold">Select Year:</label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-2 font-semibold">Select Type(s):</label>
                    <div className="mb-4">
                        {typeOptions.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={type.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </>
            )}

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

            <div className="modal-action">
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        closeModal();
                        localStorage.setItem("add", "");
                        localStorage.setItem("resources", "");
                    }}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary px-6"
                    onClick={saveNewLead}
                >
                    {competitionToEdit ? "Update" : "Save"}
                </button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
