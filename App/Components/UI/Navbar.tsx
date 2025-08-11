import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";

const Navbar = ({navigation})=>{
    return(
        <View className="bg-white border-b border-gray-200  ">
            <View className="px-4 flex-row items-center my-2 justify-between">
                <Image
                    source={require('../../Assets/Logo.png')}
                    resizeMode="contain"
                    className={'w-[120px] h-[30px]'}
                />
                <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-lg">👤</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default Navbar