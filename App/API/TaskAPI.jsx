import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

//const API_BASE_URL = 'http://localhost:3000/api/auth/tasks';
const API_BASE_URL = 'http://10.0.2.2:3000/api/auth/user';

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
export const GetTasksAPI = async (userID)=>{
  const res = await Main('Get-Tasks','get')
  return res.data
}
export const CreateTaskAPI = async (data)=>{
  const res = await Main('Create-Task','post',data)
  return res.data
}
export const UpdateTaskAPI = async (taskId,data)=>{
  const res = await Main(`Update-Task/${taskId}`,'put',data)
  return res.data
}
export const DeleteTaskAPI = async (taskId)=>{
  const res = await Main(`Delete-Task/${taskId}`,'delete',{user:'ME'})
}
