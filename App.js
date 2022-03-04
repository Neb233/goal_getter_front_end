import { StyleSheet, Text, Image, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SetSubgoals from "./components/SetGoal/SetSubgoals";
import SearchUsers from "./components/Social/SearchUsers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./components/Feed/Feed";
import SetGoal from "./components/SetGoal/SetGoal";
import GoalCalendar from "./components/Calendar/GoalCalendar";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Goals from "./components/Profile/UserPage";
import GoalPage from "./components/GoalPage/GoalPage";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import RootStack from "./components/RootStack/RootStack";

LogBox.ignoreAllLogs();

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

  function FeedStackScreen() {
    return (
      <FeedStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#5B72A4",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
          },
        }}
        options={{ title: "Test" }}
      >
        <FeedStack.Screen
          name="Feed"
          component={Feed}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Home</Text>
            ),
          }}
        />

        <FeedStack.Screen
          name="Calendar"
          component={GoalCalendar}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Calendar</Text>
            ),
          }}
        />
        <FeedStack.Screen
          name="GoalPage"
          component={GoalPage}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Goal</Text>
            ),
          }}
        />
        <FeedStack.Screen
          name="UserPage"
          component={Goals}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Profile</Text>
            ),
          }}
        />
        <GoalStack.Screen
          name="SetGoal"
          component={SetGoal}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Set Goal</Text>
            ),
          }}
        />
      </FeedStack.Navigator>
    );
  }

  function UserStackScreen() {
    return (
      <UserStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#5B72A4",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
          },
        }}
      >
        <UserStack.Screen
          name="Your Profile"
          component={Goals}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Profile</Text>
            ),
          }}
        />
        <UserStack.Screen
          name="GoalPage"
          component={GoalPage}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Goal</Text>
            ),
          }}
        />
      </UserStack.Navigator>
    );
  }

  function GoalStackScreen() {
    return (
      <GoalStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#5B72A4",
            paddingHorizontal: 80,
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <GoalStack.Screen
          name="SetGoal"
          component={SetGoal}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Set Goal</Text>
            ),
          }}
        />
        <GoalStack.Screen
          name="SetSubgoals"
          component={SetSubgoals}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>
                Set Subgoal
              </Text>
            ),
          }}
        />
      </GoalStack.Navigator>
    );
  }

  function SearchStackScreen() {
    return (
      <SearchStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#5B72A4",
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <SearchStack.Screen
          name="Search"
          component={SearchUsers}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>
                Search Users
              </Text>
            ),
          }}
        />
        <SearchStack.Screen
          name="Calendar"
          component={GoalCalendar}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Calendar</Text>
            ),
          }}
        />
        <SearchStack.Screen
          name="GoalPage"
          component={GoalPage}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Goal</Text>
            ),
          }}
        />
        <SearchStack.Screen
          name="UserPage"
          component={Goals}
          options={{
            title: "GoalGetter",
            headerTitleStyle: { color: "#fdf9e6" },
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 10 }}
                source={require("./components/GoalGetterLogo.png")}
              />
            ),
            headerRight: () => (
              <Text style={{ color: "#fdf9e6", fontSize: 18 }}>Profile</Text>
            ),
          }}
        />
      </SearchStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {profile ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "#5B72A4" },
            tabBarLabelStyle: { color: "#fdf9e6", fontSize: 13 },
            tabBarActiveBackgroundColor: "#3e4d6e",
          }}
        >
          <Tab.Screen
            name="Home"
            component={FeedStackScreen}
            options={{
              tabBarIcon: () => (
                <MaterialIcons name="dynamic-feed" color="#fdf9e6" size={25} />
              ),
            }}
          />
          <Tab.Screen
            name="Set Goals"
            component={GoalStackScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="trophy"
                  color="#fdf9e6"
                  size={25}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={UserStackScreen}
            options={{
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="account"
                  color="#fdf9e6"
                  size={25}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Search Users"
            component={SearchStackScreen}
            options={{
              tabBarIcon: () => (
                <MaterialIcons name="search" color="#fdf9e6" size={25} />
              ),
            }}
          />
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
