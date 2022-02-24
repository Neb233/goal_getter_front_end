import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/Login/LoginScreen";
import RegisterScreen from "./components/Login/RegisterScreen";
import SetGoal from "./components/Set_Goal/SetGoal";
import SubGoalForm from "./components/Set_Goal/SubGoalForm";
import Feed from "./components/Feed/Feed";
import GoalCalendar from "./components/Calendar/GoalCalendar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="GoalCalendar" component={GoalCalendar} />
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
