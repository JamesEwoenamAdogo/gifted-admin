import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Transactions from '../../features/transactions'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Users"}))
      }, [])


    return(
        <div>
         <h1>Quizzess</h1>
        <Transactions />
        </div>
    )
}

export default InternalPage