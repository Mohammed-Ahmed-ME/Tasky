import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen , Home, Login,Verify } from './Screens';

const Stack = createNativeStackNavigator();

const Navigation = () => (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="StartScreen"
                component={StartScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable back gesture on start screen
                }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable back gesture on home screen
                }}
            /><
            Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable back gesture on home screen
                }}
            /><
            Stack.Screen
                name="Verify"
                component={Verify}
                options={{
                    headerShown: false,
                    gestureEnabled: false, // Disable back gesture on home screen
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

export default Navigation;