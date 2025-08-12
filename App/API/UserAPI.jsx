import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'http://10.0.2.2:3000/api/auth/user';

//const API_BASE_URL = 'http://localhost:3000/API/Auth/User';
const Main = async (API,method,data)=>{
    const token = await AsyncStorage.getItem('token')
    const response = await axios({
        method: method,
        url: `${API_BASE_URL}/${API}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    })
    return response
}
export const LoginAPI = async (data)=>{
    const res = await Main('Login','post',data)
    return res
}
export const RegisterAPI = async (data)=>{
    const res = await Main('Register','post',data)
    return res
}
export const ProfileAPI = async ()=>{
    const token = await AsyncStorage.getItem('token')
    const res = await axios({
        "method": "GET",
        "url": `${API_BASE_URL}/Profile`,
        "headers": {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }
    })
    await AsyncStorage.setItem('user',JSON.stringify(res.data.user));
    return res.status
}
