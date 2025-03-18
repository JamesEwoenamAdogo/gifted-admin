import moment from "moment"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { showNotification } from "../common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
// import { RECENT_TRANSACTIONS } from "../../utils/dummyData"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import SearchBar from "../../components/Input/SearchBar"
import axios from "axios"
import { TbListDetails} from "react-icons/tb";
import { IoPeopleCircleSharp } from "react-icons/io5";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'




const TopSideButtons = ({removeFilter, applyFilter, applySearch}) => {

    const [isOpen, setIsOpen] = useState(false)
    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const CategoryFilters = ["Paid", "Registered"]
    

   

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
        setIsOpen(false)
    }

    useEffect(() => {
        if(searchText == ""){
            removeAppliedFilter()
        }else{
            applySearch(searchText)
        }
    }, [searchText])

    return(
        <div className="inline-block float-right">
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam !== "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className= {`dropdown dropdown-bottom dropdown-end ${isOpen? "dropdown-end":""}`} >
                <label tabIndex={0} className="btn btn-sm btn-outline" onClick={()=>{setIsOpen(!isOpen)}}><FunnelIcon className="w-5 mr-2"/>Filter</label>
                {isOpen&&<ul tabIndex={-1} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 z-50">
                    {
                        CategoryFilters.map((l, k) => {
                            return  <li  key={k}><a onClick={() => {setIsOpen(false); showFiltersAndApply(l)}}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>}
            </div>
        </div>
    )
}


function Transactions(){
    let RECENT_TRANSACTIONS= []
    const [trans, setTrans] = useState(RECENT_TRANSACTIONS)
    const [load,setLoad]= useState(false)
    const ref = useRef(RECENT_TRANSACTIONS)
    const [examUsers,setUserExams]= useState([])
    useEffect(()=>{
        const fetchData = async()=>{
            const response= await axios.get("/all-users")
            console.log(response.data.user)
            const examName = localStorage.getItem("name")
            const filteredRegistered = response.data.user.filter((item)=>{ let name="" ; for(let examItem of item.Registered){if(examItem==examName){name=examItem}};return name==examName})
            // const filteredPaid = response.data.user.filter((item)=>{ for(let examItem of item.Paid){ return examItem == examName}})
            
            setTrans(()=>{return [...filteredRegistered]})
            RECENT_TRANSACTIONS = filteredRegistered
            // setLoad(true)
            ref.current = RECENT_TRANSACTIONS
            setUserExams(()=>{return response.data.user})
            
            
        }
        fetchData()

    },[])


  

    const removeFilter = () => {
        setTrans(()=>{return [...ref.current]})
    }

    const applyFilter = (params) => {
        if(params=="Registered"){
            setTrans(()=>{return ref.current})
        }
        else{
            const examName = localStorage.getItem("name")

            
            const filteredRegistered = ref.current.filter((item)=>{ let name="" ; for(let examItem of item.Paid){if(examItem==examName){name=examItem}};return name==examName})
            
            setTrans(()=>{return [...filteredRegistered]})
        }
      
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = ref.current.filter((t) => {return t.email.toLowerCase().includes(value.toLowerCase()) ||  t.email.toLowerCase().includes(value.toLowerCase()) || t.firstName.toLowerCase().includes(value.toLowerCase()) ||  t.firstName.toLowerCase().includes(value.toLowerCase()) || t.lastName.toLowerCase().includes(value.toLowerCase()) ||  t.lastName.toLowerCase().includes(value.toLowerCase())})
        setTrans(filteredTransactions)
    }

    return(
        <>
            
            <TitleCard title="All Users" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>PhoneNumber</th>
                        <th>D_O_B</th>
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            trans.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                
                                            </div>
                                            <div>
                                                <div className="font-bold">{`${l.firstName} ${l.lastName}`}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{l.email}</td>
                                    <td>{l.mobileNumber}</td>
                                    <td>{l.DOB}</td>
                                    <td>{l.Category}</td>
                                    <td><button className="btn btn-square btn-ghost" onClick={()=>{ delete l.password ; localStorage.setItem("details",JSON.stringify(l)); window.location.href="/app/user-details"}}><IoPeopleCircleSharp className="w-10"/></button></td>
                                    
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


export default Transactions