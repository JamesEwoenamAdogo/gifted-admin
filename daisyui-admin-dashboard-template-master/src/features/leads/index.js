import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteLead, getLeadsContent } from "./leadSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { FaEdit } from "react-icons/fa";
import { IoPeopleCircleSharp } from "react-icons/io5";

import { FcViewDetails } from "react-icons/fc";

import { TbListDetails } from "react-icons/tb";
import { showNotification } from '../common/headerSlice'
import axios from "axios"

const TopSideButtons = () => {

    const dispatch = useDispatch()

    const openAddNewLeadModal = () => {
        dispatch(openModal({title : "Add New", bodyType : MODAL_BODY_TYPES.LEAD_ADD_NEW}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New Competition</button>
        </div>
    )
}

function Leads(){

    const {leads } = useSelector(state => state.lead)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLeadsContent())
        console.log(leads)
     
    }, [])

    

    const getDummyStatus = (index) => {
        if(index % 5 === 0)return <div className="badge">Not Interested</div>
        else if(index % 5 === 1)return <div className="badge badge-primary">In Progress</div>
        else if(index % 5 === 2)return <div className="badge badge-secondary">Sold</div>
        else if(index % 5 === 3)return <div className="badge badge-accent">Need Followup</div>
        else return <div className="badge badge-ghost">Open</div>
    }

    const deleteCurrentLead = (index) => {
        dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : `Are you sure you want to delete this?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, index}}))
    }

    return(
        <>
            
            <TitleCard title="All" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>StartDate</th>
                        <th>EndDate</th>
                        {/* <th>SubTypes</th> */}
                        <th>Cost</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            leads.map((l, k) => {
                                return(
                                    <tr key={k}>
                                   
                                    <td>{l.name}</td>
                                    <td>{l.startDate}</td>
                                    <td>{l.EndDate}</td>
                                    <td>{l.cost}</td>
                                    <td>{}</td>
                                    <td>
                                    <button
                                        onClick={() => {
                                        localStorage.setItem("editCompetition", JSON.stringify(l));
                                        window.location.href = "/app/edit-competition";
                                        }}
                                        className="mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn btn-square btn-ghost"
                                        onClick={() => deleteCurrentLead(k)}
                                    >
                                        <TrashIcon className="w-5" />
                                    </button>
                                    </td>

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            </TitleCard>
        </>
    )
}


export default Leads