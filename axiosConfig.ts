import axios from "axios";

const axiosApi = axios.create({baseURL : 'https://nowted-server.remotestate.com', headers : {"Content-Type" : 'application/json'}})

export default axiosApi