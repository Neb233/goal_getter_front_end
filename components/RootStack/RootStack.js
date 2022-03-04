import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Login/LoginScreen";
import RegisterScreen from "../Login/RegisterScreen";
import SplashScreen from "../Login/SplashScreen";
import Feed from "../Feed/Feed";

const RootStackNav = createNativeStackNavigator();

const RootStack = () => {
  return (
    <RootStackNav.Navigator>
      <RootStackNav.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <RootStackNav.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <RootStackNav.Screen name="RegisterScreen" component={RegisterScreen} />
      <RootStackNav.Screen name="Feed" component={Feed} />
    </RootStackNav.Navigator>
  );
};

export default RootStack;
