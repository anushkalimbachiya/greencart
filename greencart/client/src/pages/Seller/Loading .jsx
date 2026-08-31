import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const Loding = () => {

    const { navigate } = useNavigate()
    let { search } = useLocation()
    const queryPram = usePramser(search)
    const nextUrl = query.get("next")

    useEffect(()=>{
        if (nextUrl){
            setTimeout(() => {
                navigate(nextUrl)
            }, 5000); 
        }
    },[nextUrl])

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-24 w-24 border-4 border-green-300 border-t-primary '></div>

        </div>
    )
}

export default Loding