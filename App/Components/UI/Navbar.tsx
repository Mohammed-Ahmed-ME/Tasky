import {Image, Text, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {LogOut} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = ({navigation,user})=>{
    const avatar = user.name[0].toUpperCase()
    const [menu , setMenu] = useState(false)
    return(
        <View className="bg-white border-b border-gray-200 relative ">
            <View className="px-4 flex-row items-center my-2 justify-between">
                <Image
                    source={require('../../Assets/Logo.png')}
                    resizeMode="contain"
                    className={'w-[120px] h-[30px]'}
                />
                <TouchableOpacity onPress={()=>{
                    setMenu(!menu)
                }} className="w-10 h-10 rounded-full items-center justify-center bg-[#0055FF]">
                    {user?.img ? (<Image
                        source={require('../../Assets/user.png')}
                        className={'h-10 w-10 rounded-full'}
                    />):(
                        <Text className={'text-2xl text-white'}>{avatar}</Text>
                    )}

                </TouchableOpacity>
            </View>
            {menu && (
                <View className={'w-56 h-36 bg-gray-200 absolute top-12 right-10 z-50 rounded-2xl p-2'}>
                    <View className={'flex-row items-center gap-1 border-b-2 border-white py-1'}>
                    <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-[#0055FF] ">
                        {user?.img ? (<Image
                            source={require('../../Assets/user.png')}
                            className={'h-12 w-12 rounded-full'}
                        />):(
                            <Text className={'text-xl text-white'}>{avatar}</Text>
                        )}

                    </TouchableOpacity>
                    <Text className={'text-lg'}>{user.name}</Text>
                    </View>
                    <TouchableOpacity className={'border-b-2 border-white h-10 px-2 justify-center'}>
                        <Text className={'text-xl'}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        AsyncStorage.removeItem('token')
                        AsyncStorage.removeItem('user')
                        navigation.replace('Login')
                    }} className={'h-10 px-2 justify-start mt-1 flex-row gap-2 '}>
                        <LogOut color={'red'}/>
                        <Text className={'text-xl'}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
export default Navbar


