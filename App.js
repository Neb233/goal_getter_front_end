import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/Login/LoginScreen";
import RegisterScreen from "./components/Login/RegisterScreen";
import SetGoal from "./components/Set_Goal/SetGoal";
import SubGoalForm from "./components/Set_Goal/SubGoalForm";
import Feed from "./components/Feed/Feed";
import Social from "./components/Social/Social";
import Nav from "./components/Nav/Nav";
import Profile from "./components/Profile/Profile";
import SetGoalIntro from "./components/Set_Goal/SetGoalIntro";

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [constructedGoal, setConstructedGoal] = useState({});

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Nav"
          component={Nav}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="SetGoalIntro"
          component={SetGoalIntro}
          setConstructedGoal={setConstructedGoal}
        />
        <Stack.Screen name="SetGoal" component={SetGoal} />
        <Stack.Screen name="SubGoalForm" component={SubGoalForm} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efbcd9",
    alignItems: "center",
    justifyContent: "center",
  },
});

{
  /* <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
         <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SetGoal" component={SetGoal} />
        <Stack.Screen name="SubGoalForm" component={SubGoalForm} /> 
      </Stack.Navigator>
      
   
             <Tab.Screen name='Feed' component={Feed} />
            <Tab.Screen name='SetGoal' component={SetGoal} />
            <Tab.Screen name='Social' component={Social} /> */
}
