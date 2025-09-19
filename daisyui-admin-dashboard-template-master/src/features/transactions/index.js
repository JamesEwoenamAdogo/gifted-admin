import moment from "moment";
import { useEffect, useState, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SearchBar from "../../components/Input/SearchBar";
import axios from "axios";
import { IoPeopleCircleSharp } from "react-icons/io5";
import * as XLSX from "xlsx";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch, handleDownload, filterOptions }) => {
    const [isOpen, setIsOpen] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({});

    const handleFilter = (type, value) => {
        const updated = { ...appliedFilters, [type]: value };
        setAppliedFilters(updated);
        applyFilter(updated);
        setIsOpen(null);
    };

    const clearFilters = () => {
        setAppliedFilters({});
        removeFilter();
        setSearchText("");
    };

    useEffect(() => {
        if (searchText === "") {
            applyFilter(appliedFilters);
        } else {
            applySearch(searchText);
        }
    }, [searchText]);

    return (
        <div className="inline-block float-right space-x-2">
            <SearchBar searchText={searchText} styleClass="mr-2" setSearchText={setSearchText} />
            <button onClick={handleDownload} className="btn btn-sm btn-outline">Download Excel</button>

            {Object.keys(filterOptions).map((type, index) => (
                <div key={index} className="dropdown dropdown-bottom dropdown-end inline-block">
                    <label
                        tabIndex={0}
                        className="btn btn-sm btn-outline"
                        onClick={() => setIsOpen(isOpen === type ? null : type)}
                    >
                        <FunnelIcon className="w-4 mr-1" /> {type}
                    </label>
                    {isOpen === type && (
                        <ul
                            tabIndex={-1}
                            className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52 z-50"
                        >
                            {filterOptions[type].map((value, k) => (
                                <li key={k}>
                                    <a onClick={() => handleFilter(type, value)}>{value}</a>
                                </li>
                            ))}
                            <div className="divider mt-1 mb-1"></div>
                            <li><a onClick={() => handleFilter(type, "")}>Remove {type} Filter</a></li>
                        </ul>
                    )}
                </div>
            ))}

            {Object.entries(appliedFilters).length > 0 && (
                <button
                    onClick={clearFilters}
                    className="btn btn-xs btn-active btn-ghost normal-case ml-2"
                >
                    Clear All Filters <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
        </div>
    );
};

function Transactions() {
    const [trans, setTrans] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [interest, setInterest] = useState([]);
    const ref = useRef([]);

    useEffect(() => {
        const fetchInterest = async () => {
            const response = await axios.get("/all-interest");
            const items = response.data.allInterest || [];
            const names = items.map(i => i.name).filter(Boolean);
            setInterest(names);
        };
        fetchInterest();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/all-users");
            const users = response.data.user || [];
            setTrans(users);
            ref.current = users;

            const extractUnique = (key) => {
                return [...new Set(users.map(u => u[key]).filter(Boolean).map(v => v.toString()))];
            };

            setFilterOptions({
                Category: extractUnique("Category"),
                School: extractUnique("School"),
                Gender: extractUnique("gender"),
                Grade: Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
                Country: extractUnique("country"),
                Purpose: interest
            });
        };

        fetchData();
    }, [interest]);

    const removeFilter = () => {
        setTrans([...ref.current]);
    };

    const applyFilter = (filterObj) => {
        const filtered = ref.current.filter((t) => {
            return Object.entries(filterObj).every(([key, value]) => {
                if (!value) return true;

                if (key === "Purpose") {
                    if (Array.isArray(t.purposeOfRegistration)) {
                        return t.purposeOfRegistration
                            .map(p => p.toLowerCase())
                            .includes(value.toLowerCase());
                    }
                    return false;
                }

                if (key === "Grade") {
                    return `Grade ${t.grade}` === value;
                }

                if (key === "Gender") {
                    return t.gender?.toLowerCase() === value.toLowerCase();
                }

                if (key === "Country") {
                    return t.country?.toLowerCase() === value.toLowerCase();
                }

                if (t[key] && typeof t[key] === "string") {
                    return t[key].toLowerCase() === value.toLowerCase();
                }

                return false;
            });
        });
        setTrans(filtered);
    };

    const applySearch = (value) => {
        const search = value.toLowerCase();
        const filtered = ref.current.filter((t) =>
            t.email?.toLowerCase().includes(search) ||
            t.firstName?.toLowerCase().includes(search) ||
            t.lastName?.toLowerCase().includes(search)
        );
        setTrans(filtered);
    };

    const handleDownload = () => {
        const data = trans.map((user, index) => ({
            "#": index + 1,
            Name: `${user.firstName} ${user.lastName}`,
            Email: user.email,
            PhoneNumber: user.mobileNumber,
            DOB: user.DOB,
            Category: user.Category,
            School: user.School,
            Gender: user.gender,
            Grade: user.grade,
            Country: user.country,
            Purpose: Array.isArray(user.purposeOfRegistration)
                ? user.purposeOfRegistration.join(", ")
                : user.purposeOfRegistration,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "Filtered_Users.xlsx");
    };

    return (
        <TitleCard
            title={`All Users (${trans.length})`}
            topMargin="mt-2"
            TopSideButtons={
                <TopSideButtons
                    applySearch={applySearch}
                    applyFilter={applyFilter}
                    removeFilter={removeFilter}
                    handleDownload={handleDownload}
                    filterOptions={filterOptions}
                />
            }
        >
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
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
                                <td>{k + 1}</td>
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
                                            delete l.password;
                                            localStorage.setItem("details", JSON.stringify(l));
                                            window.location.href = "/app/user-details";
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
    );
}

export default Transactions;
