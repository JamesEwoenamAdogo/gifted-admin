import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Leads from '../../features/leads copy'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "AddOns"}))
      }, [])


    return(
        <Leads />
    )
}

export default InternalPage