import { useState } from "react";
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
    cost: ""
};

function AddLeadModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const typeOptions = ["Mathematics", "Science", "English","ICT","Geography"];
    const [type, setType] = useState([]); // Changed to array for checkboxes

    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
    }

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const handleCheckboxChange = (option) => {
        setType((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const saveNewLead = async () => {
        const id = localStorage.getItem("id")
        if (leadObj.name.trim() === "") return setErrorMessage("Name is required!");
        if (leadObj.startDate.trim() === "") return setErrorMessage("Start Date required!");
        if (leadObj.EndDate.trim() === "") return setErrorMessage("End Date required!");
        if (leadObj.cost.trim() === "") return setErrorMessage("Cost is required!");

        const newLeadObj = {
            ...leadObj,
            type: type,
            year: selectedYear,
            registered: [],
            paid: [],
            id
        };

     
        const response = await axios.post("/add-competition", newLeadObj);
        if (response.data.success) {
            dispatch(addNewLead({ newLeadObj }));
            dispatch(showNotification({ message: "New item added", status: 1 }));
            closeModal();
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
                        labelTitle="name"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Date"
                        defaultValue={leadObj.startDate}
                        updateType="startDate"
                        containerStyle="mt-4"
                        labelTitle="startDate"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Date"
                        defaultValue={leadObj.EndDate}
                        updateType="EndDate"
                        containerStyle="mt-4"
                        labelTitle="EndDate"
                        updateFormValue={updateFormValue}
                    />

                    <InputText
                        type="Number"
                        defaultValue={leadObj.cost}
                        updateType="cost"
                        containerStyle="mt-4"
                        labelTitle="Cost"
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
                    Save
                </button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
