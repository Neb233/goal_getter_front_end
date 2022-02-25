import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationHelpersContext } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-web";
import Feed from "../Feed/Feed";
import SetGoal from "../Set_Goal/SetGoal";
import Social from "../Social/Social";
// import Calender from '../Calender/Calender';
import Profile from "../Profile/Profile";
import LoginScreen from "../Login/LoginScreen";

import SearchUsers from "../Social/SearchUsers";

const Tab = createBottomTabNavigator();

const Nav = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName="Feed" options={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="SetGoal" component={SetGoal} />
      <Tab.Screen name="Profile" component={Profile} />
      {/* <Tab.Screen name='Calender' component={Calender} /> */}
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="SearchUsers" component={SearchUsers} />
    </Tab.Navigator>
  );
};

export default Nav;
