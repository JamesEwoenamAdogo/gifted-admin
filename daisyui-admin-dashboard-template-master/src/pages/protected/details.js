import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import { openModal } from "../../features/common/modalSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { IoPeopleCircleOutline } from "react-icons/io5";






const TopSideButtons = () => {

    const dispatch = useDispatch()

    const openAddNewLeadModal = () => {
        dispatch(openModal({title : `Add New to ${localStorage.getItem("name")}`, bodyType : MODAL_BODY_TYPES.LEAD_ADD_NEW}))
        
    }

    return(
        <div className="inline-block float-right">

            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => {openAddNewLeadModal();localStorage.setItem("add","true")}}>Add New Competition</button>
        </div>
    )
}
function Details(){
    const id = localStorage.getItem("id")
    const [SubTypes,setSubtypes]= useState([])
    const [competitionName,setCompetitionName]= useState("")

  useEffect(()=>{
    const fecthCompetitions = async()=>{
        const response = await axios.get('/all-competitions')
        console.log(response.data.AllCompetitions)
	    const allCompetition =response.data.AllCompetitions
        const competition = allCompetition.find((item)=>{return item._id==id})
        setCompetitionName(competition.name)
        setSubtypes(()=>{return [...competition.subTypes]})
        
        
    }
    fecthCompetitions()


  },[])







    return(
        <div className="overflow-x-auto w-full">
            <TopSideButtons />

            <div className="text-3xl font-semibold">{localStorage.getItem("name")}</div>
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>StartDate</th>
                        <th>EndDate</th>
                        <th>Cost</th>
                        <th>Paid</th>
                        <th>Registered</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            SubTypes.map((l, k) => {
                                return(
                                    <tr key={k}>
                                   
                                    <td>{l.name}</td>
                                    <td>{l.startDate}</td>
                                    <td>{l.EndDate}</td>
                                    <td>{l.cost}</td>
                                    <td>{l.paid}</td>
                                    <td>{l.registered}</td>
                                    <td><button className="btn btn-square btn-ghost" onClick={()=>{localStorage.setItem("name",l.name); window.location.href="/app/exam-details"}}><IoPeopleCircleOutline/></button></td>
                                    

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>



    )







}

export default Details