import { useLocation } from "react-router-dom"

export default function useQueryParams(){
    type myObj = {
        [key : string] : string
    }
    const params : myObj = {}
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    
    for(const param of searchParams){
        params[param[0]] = param[1]
    }
    return params
}