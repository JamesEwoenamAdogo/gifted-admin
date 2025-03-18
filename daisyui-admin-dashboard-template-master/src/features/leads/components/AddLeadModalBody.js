import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead } from "../leadSlice"
import axios from "axios"

const INITIAL_LEAD_OBJ = {
    name : "",
    startDate : "",
    EndDate:"",
    cost : ""
}

function AddLeadModalBody({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ)


    const saveNewLead = async() => {
        console.log(leadObj)
        if(leadObj.name.trim() === "")return setErrorMessage("Name is required!")
        else if(leadObj.startDate.trim() === "")return setErrorMessage("Start Date required!")
        else if(leadObj.EndDate.trim() === "")return setErrorMessage("End Date required!")
        else if(leadObj.cost.trim() === "")return setErrorMessage("Cost is required!")
        else if(localStorage.getItem("add")){
            let newLeadObj = {
                "name": leadObj.name,
                "startDate": leadObj.startDate,
                "EndDate": leadObj.EndDate,
                "cost": leadObj.cost,
                "registered":0,
                "paid":0
                
            }
            let newSubTypes =[]
            if(!localStorage.getItem("subTypes")){
                newSubTypes.push(newLeadObj)
            }
            else{
                newSubTypes = [...JSON.parse(localStorage.getItem("subTypes")),newLeadObj]
            }
            console.log(newSubTypes)
            const response = await axios.put(`/update-competition/${localStorage.getItem("id")}`,{subTypes: newSubTypes})
            if(response.data.success){
                dispatch(addNewLead({newLeadObj}))
                dispatch(showNotification({message : "New Lead Added!", status : 1}))
                closeModal()
                localStorage.getItem("add","")

                
            }

        }
        else{
            let newLeadObj = {
                "name": leadObj.name,
                "startDate": leadObj.startDate,
                "EndDate": leadObj.EndDate,
                "cost": leadObj.cost,
                
                
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

    return(
        <>
          {localStorage.getItem("resources")?
            <InputText type="file"/>:
            <>
            <InputText type="text" defaultValue={leadObj.name} updateType="name" containerStyle="mt-4" labelTitle="name" updateFormValue={updateFormValue}/>

            <InputText type="Date" defaultValue={leadObj.startDate} updateType="startDate" containerStyle="mt-4" labelTitle="startDate" updateFormValue={updateFormValue}/>

            <InputText type="Date" defaultValue={leadObj.EndDate} updateType="EndDate" containerStyle="mt-4" labelTitle="EndDate" updateFormValue={updateFormValue}/>

            <InputText type="number" defaultValue={leadObj.cost} updateType="cost" containerStyle="mt-4" labelTitle="cost" updateFormValue={updateFormValue}/>


            
            </>
            }
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => {closeModal();localStorage.setItem("add","");localStorage.setItem("resources","")}}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    )
}

export default AddLeadModalBody