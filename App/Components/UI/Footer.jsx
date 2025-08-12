import {View,TouchableOpacity,Text} from 'react-native'
import {HomeIcon,AlarmClock,Plus,LucideColumnsSettings} from "lucide-react-native";
const Footer = ({handleAddTask,navigation})=>{
    const nav = dir =>{
      navigation.navigate(dir)
    }

    return(
        <View className=" relative bg-white h-18 justify-center ">
            <View className="px-8 flex-row items-center my-2 justify-between">
                <TouchableOpacity onPress={()=>{
                    nav('Home')
                }} className=" rounded-full items-center justify-center">
                    <HomeIcon color={'#0841c5'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  nav("Reminders")
                }} className=" rounded-full items-center justify-center">
                    <AlarmClock color={'#0841c5'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddTask} className=" -mt-10 bg-[#0055ff] text-white w-16 h-16  rounded-full items-center justify-center">
                    <Plus color={'white'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  nav("Reminders")
                }} className="  rounded-full items-center justify-center">
                    <Plus color={'#0841c5'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  nav("Settings")
                }} className="  rounded-full items-center justify-center">
                    <LucideColumnsSettings color={'#0841c5'} size={30}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default Footer