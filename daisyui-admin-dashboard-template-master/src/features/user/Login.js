import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"


function Login(){
    const [email, setEmail]= useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading]= useState(false)
    const [loginObj,setLoginObj]= useState({email:"",password:""})
    // const navigate = useNavigate()

  

    const submitForm = async (e) =>{
        let response =""

        try{
        e.preventDefault()
        setErrorMessage("")
        if(loginObj.email.trim() === "")return setErrorMessage("Email Id is required! (use any value)")
        if(loginObj.password.trim() === "")return setErrorMessage("Password is required! (use any value)")
        else{
            response = await axios.post("/admin-login",loginObj)
            // const allCompetitionResponse = await axios.get("/all-competitions")
            // console.log(allCompetitionResponse)
            // localStorage.setItem("allCompetition", JSON.stringify(allCompetitionResponse.data.AllCompetitions))
            if(response.data.success){
            
                setLoading(true)
                localStorage.setItem("token", response.data.token)
                setLoading(false)
                // navigate("/admin-dashboard")
                 window.location.href = '/app/dashboard'
            }else{
                setLoading(false)
                toast.error(response.data.message, {toastId:"my-id"})
            }
            
            
        }}catch(error){
            
            setLoading(false)
            console.log(error)
            setErrorMessage(error)
           
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }
    

 

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="emailId" defaultValue={email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />

                            <InputText defaultValue={password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        {/* <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div> */}

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>

                        {/* <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div> */}
                    </form>
                </div>
                <ToastContainer/>
            </div>
            </div>
        </div>
    )
}

export default Login