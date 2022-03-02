import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/Login/LoginScreen";
import RegisterScreen from "./components/Login/RegisterScreen";
import SetGoal from "./components/Set_Goal/SetGoal";
import SubGoalForm from "./components/Set_Goal/SubGoalForm";
import SearchUsers from "./components/Social/SearchUsers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./components/Feed/Feed";
import Social from "./components/Feed/Social";
import Nav from "./components/Nav/Nav";
import Profile from "./components/Profile/Profile";
import SetGoalIntro from "./components/Set_Goal/SetGoalIntro";
import GoalCalendar from "./components/Calendar/GoalCalendar";
import React, { useEffect, useState, useContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "./firebase";
import { UserContext, UserProvider } from "./context/user";
import Goals from "./components/Profile/UserPage";
import GoalPage from "./components/GoalPage/GoalPage";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'


import RootStack from "./components/RootStack/RootStack";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [profile, SetProfile] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        SetProfile(true);
      } else {
        SetProfile(false);
      }

    });
  }, []);

  const FeedStack = createNativeStackNavigator();
  const UserStack = createNativeStackNavigator();
  const GoalStack = createNativeStackNavigator();
  const SearchStack = createNativeStackNavigator();

 function Logo() {
  return (<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
<Image
source={require('./components/Profile/blank_avatar.png')}
resizeMode="contain"
style={{ width: 98 }}
/>
</View>
  )
  }


  function FeedStackScreen() {
    return (
           <FeedStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#5B72A4',  }, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold', textAlign: "center", alignSelf: "center"},
        }} options={{title: 'Test'}}>
        <FeedStack.Screen name="Feed" component={Feed} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <FeedStack.Screen name="Calendar" component={GoalCalendar} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <FeedStack.Screen name="Profile" component={Profile} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <FeedStack.Screen name="GoalPage" component={GoalPage} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <FeedStack.Screen name="UserPage" component={Goals} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
      </FeedStack.Navigator>
    );
  }

  function UserStackScreen() {
    return (
      <UserStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#5B72A4',  }, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold', textAlign: "center", alignSelf: "center"},
        }}>
        <UserStack.Screen name="UserPage" component={Goals} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <UserStack.Screen name="GoalPage" component={GoalPage} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        {/* <UserStack.Screen name="Test" component={SetGoalIntro} /> */}
      </UserStack.Navigator>
    );
  }

  function GoalStackScreen() {
    return (
      <GoalStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#5B72A4', paddingHorizontal: 80  }, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <GoalStack.Screen name="SetGoalIntro" component={SetGoalIntro} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <GoalStack.Screen name="SetGoal" component={SetGoal} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        {/* <GoalStack.Screen name="" component={} /> */}
      </GoalStack.Navigator>
    );
  }

  function SearchStackScreen() {
    return (
      <SearchStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#5B72A4',  }, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <SearchStack.Screen name="Search" component={SearchUsers} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <SearchStack.Screen name="Calendar" component={GoalCalendar} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <SearchStack.Screen name="GoalPage" component={GoalPage} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        <SearchStack.Screen name="UserPage" component={Goals} options={{title: <Image style={{width: 40, height: 40, marginLeft: 225, marginTop: 5}} source={require('./components/Profile/blank_avatar.png')}/>}}/>
        {/* <SearchStack.Screen name="" component={} /> */}
      </SearchStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {profile ? (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={FeedStackScreen} options={{tabBarIcon: () => (<MaterialIcons name="dynamic-feed" color='black' size='2'/>)}}/>
          <Tab.Screen name="Set Goals" component={GoalStackScreen} options={{tabBarIcon: () => (<MaterialCommunityIcons name="trophy" color='black' size='10'/>)}}/>
          <Tab.Screen name="Profile" component={UserStackScreen} options={{tabBarIcon: () => (<MaterialCommunityIcons name="account" color='black' size='10'/>)}}/>

          <Tab.Screen name="Search Users" component={SearchStackScreen} options={{tabBarIcon: () => (<MaterialIcons name="search" color='black' size='5'/>)}}/>
        </Tab.Navigator>
      ) : (
        <RootStack />
      )}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efbcd9",
    alignItems: "center",
    justifyContent: "center",
  },
});


{/* <Stack.Navigator>
        //   <Stack.Screen */}
        //     name="Nav"
        //     component={Nav}
        //     options={{ headerShown: false }}
        //   />

        //   <Stack.Screen name="Feed" component={Feed} />
        //   <Stack.Screen name="SetGoal" component={SetGoal} />
        //   <Stack.Screen name="GoalCalendar" component={GoalCalendar} />
        //   <Stack.Screen name="SubGoalForm" component={SubGoalForm} />
        //   <Stack.Screen name="Profile" component={Profile} />
        //   <Stack.Screen name="SearchUsers" component={SearchUsers} />

        //   <Stack.Screen name="Login" component={LoginScreen} />

        //   <Stack.Screen name="UserPage" component={Goals} />
        //   <Stack.Screen name="SetGoalIntro" component={SetGoalIntro} />

        //   <Stack.Screen name="Register" component={RegisterScreen} />
        // </Stack.Navigator>


