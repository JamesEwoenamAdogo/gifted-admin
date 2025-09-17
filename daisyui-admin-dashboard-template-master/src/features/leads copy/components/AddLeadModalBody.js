import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common copy/headerSlice"
import { addNewLead } from "../leadSlice"
import axios from "axios"

const INITIAL_LEAD_OBJ = {
    name : "",
    startDate : "",
    EndDate:"",
    cost : "",
    grades: []
}

function AddLeadModalBody({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ)
    const [gradesOpen, setGradesOpen] = useState(false)


    const saveNewLead = async() => {
        console.log(leadObj.name)
        if(leadObj.name.trim() === "")return setErrorMessage("Name is required!")
        else if(leadObj.startDate.trim() === "")return setErrorMessage("Start Date required!")
        else if(leadObj.EndDate.trim() === "")return setErrorMessage("End Date required!")
        else if(leadObj.cost.trim() === "")return setErrorMessage("Cost is required!")
        else{
            let newLeadObj = {
                "name": leadObj.name,
                "startDate": leadObj.startDate,
                "EndDate": leadObj.EndDate,
                "cost": leadObj.cost,
                "grades": leadObj.grades,
                
            }
            const response = await axios.post("/add-competition",newLeadObj)
            if(response.data.success){
                dispatch(addNewLead({newLeadObj}))
                dispatch(showNotification({message : "New Lead Added!", status : 1}))
                closeModal()

                
            }
              
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLeadObj({...leadObj, [updateType] : value})
    }

    const toggleGradeSelection = (gradeNumber) => {
        setLeadObj((prev) => {
            const alreadySelected = prev.grades.includes(gradeNumber)
            const updatedGrades = alreadySelected
                ? prev.grades.filter((g) => g !== gradeNumber)
                : [...prev.grades, gradeNumber]
            return { ...prev, grades: updatedGrades }
        })
    }

    return(
        <>

            <InputText type="text" defaultValue={leadObj.name} updateType="name" containerStyle="mt-4" labelTitle="name" updateFormValue={updateFormValue}/>

            <InputText type="Date" defaultValue={leadObj.startDate} updateType="startDate" containerStyle="mt-4" labelTitle="startDate" updateFormValue={updateFormValue}/>

            <InputText type="Date" defaultValue={leadObj.EndDate} updateType="EndDate" containerStyle="mt-4" labelTitle="EndDate" updateFormValue={updateFormValue}/>

            <InputText type="number" defaultValue={leadObj.cost} updateType="cost" containerStyle="mt-4" labelTitle="cost" updateFormValue={updateFormValue}/>


            {/* Grades dropdown with checkboxes */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Grades</label>
                <div className="relative">
                    <button type="button" className="btn btn-outline w-full justify-between" onClick={() => setGradesOpen(!gradesOpen)}>
                        <span>
                            {leadObj.grades.length > 0 ? `Selected: ${leadObj.grades.sort((a,b)=>a-b).join(', ')}` : "Select grades"}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${gradesOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.24 4.525a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {gradesOpen && (
                        <div className="absolute z-10 mt-2 w-full bg-base-100 border rounded shadow p-3 max-h-60 overflow-auto">
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(12)].map((_, idx) => {
                                    const gradeNum = idx + 1
                                    const checked = leadObj.grades.includes(gradeNum)
                                    return (
                                        <label key={gradeNum} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={checked}
                                                onChange={() => toggleGradeSelection(gradeNum)}
                                            />
                                            <span>{gradeNum}</span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    )
}

export default AddLeadModalBody