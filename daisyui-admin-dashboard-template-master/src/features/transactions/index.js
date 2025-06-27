import moment from "moment"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "../common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import SearchBar from "../../components/Input/SearchBar"
import axios from "axios"
import { TbListDetails } from "react-icons/tb"
import { IoPeopleCircleSharp } from "react-icons/io5"
import * as XLSX from "xlsx"

const TopSideButtons = ({ removeFilter, applyFilter, applySearch, handleDownload }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const CategoryFilters = ["Student", "Graduate", "Parent"]

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
        if (searchText === "") {
            removeAppliedFilter()
        } else {
            applySearch(searchText)
        }
    }, [searchText])

    return (
        <div className="inline-block float-right space-x-2">
            <SearchBar searchText={searchText} styleClass="mr-2" setSearchText={setSearchText} />
            <button onClick={handleDownload} className="btn btn-sm btn-outline">Download Excel</button>
            {filterParam !== "" && (
                <button onClick={removeAppliedFilter} className="btn btn-xs btn-active btn-ghost normal-case">
                    {filterParam} <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
            <div className={`dropdown dropdown-bottom dropdown-end ${isOpen ? "dropdown-end" : ""}`}>
                <label tabIndex={0} className="btn btn-sm btn-outline" onClick={() => setIsOpen(!isOpen)}>
                    <FunnelIcon className="w-5 mr-2" />Filter
                </label>
                {isOpen && (
                    <ul tabIndex={-1} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 z-50">
                        {CategoryFilters.map((l, k) => (
                            <li key={k}>
                                <a onClick={() => { setIsOpen(false); showFiltersAndApply(l) }}>{l}</a>
                            </li>
                        ))}
                        <div className="divider mt-0 mb-0"></div>
                        <li><a onClick={removeAppliedFilter}>Remove Filter</a></li>
                    </ul>
                )}
            </div>
        </div>
    )
}

function Transactions() {
    let RECENT_TRANSACTIONS = []
    const [trans, setTrans] = useState(RECENT_TRANSACTIONS)
    const [load, setLoad] = useState(false)
    const ref = useRef(RECENT_TRANSACTIONS)

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/all-users")
            setTrans([...response.data.user])
            RECENT_TRANSACTIONS = response.data.user
            ref.current = RECENT_TRANSACTIONS
        }
        fetchData()
    }, [])

    const removeFilter = () => {
        setTrans([...ref.current])
    }

    const applyFilter = (params) => {
        let filtered = ref.current.filter((t) => t.Category === params)
        setTrans([...filtered])
    }

    const applySearch = (value) => {
        const search = value.toLowerCase()
        const filtered = ref.current.filter((t) =>
            t.email?.toLowerCase().includes(search) ||
            t.firstName?.toLowerCase().includes(search) ||
            t.lastName?.toLowerCase().includes(search)
        )
        setTrans(filtered)
    }

    const handleDownload = () => {
        const data = ref.current.map((user) => ({
            Name: `${user.firstName} ${user.lastName}`,
            Email: user.email,
            PhoneNumber: user.mobileNumber,
            DOB: user.DOB,
            Category: user.Category
        }))
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users")
        XLSX.writeFile(workbook, "All_Users.xlsx")
    }

    return (
        <>
            <TitleCard
                title="All Users"
                topMargin="mt-2"
                TopSideButtons={
                    <TopSideButtons
                        applySearch={applySearch}
                        applyFilter={applyFilter}
                        removeFilter={removeFilter}
                        handleDownload={handleDownload}
                    />
                }
            >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>PhoneNumber</th>
                                <th>D_O_B</th>
                                <th>Category</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trans.map((l, k) => (
                                <tr key={k}>
                                    <td>
                                        <div className="font-bold">{`${l.firstName} ${l.lastName}`}</div>
                                    </td>
                                    <td>{l.email}</td>
                                    <td>{l.mobileNumber}</td>
                                    <td>{l.DOB}</td>
                                    <td>{l.Category}</td>
                                    <td>
                                        <button
                                            className="btn btn-square btn-ghost"
                                            onClick={() => {
                                                delete l.password
                                                localStorage.setItem("details", JSON.stringify(l))
                                                window.location.href = "/app/user-details"
                                            }}
                                        >
                                            <IoPeopleCircleSharp className="w-10" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    )
}

export default Transactions
