import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "../Feed/Feed";
import SetGoal from "../Set_Goal/SetGoal";
import Profile from "../Profile/Profile";
import Goals from "../Profile/UserPage";
import LoginScreen from "../Login/LoginScreen";
import SetGoalIntro from "../Set_Goal/SetGoalIntro";
import SearchUsers from "../Social/SearchUsers";
import GoalPage from "../GoalPage/GoalPage";

const Tab = createBottomTabNavigator();

const Nav = ({ navigation }) => {
  return (
    <Tab.Navigator options={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="SetGoal" component={SetGoal} />
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="UserPage" component={Goals} />
      <Tab.Screen name="GoalPage" component={GoalPage} />
      <Tab.Screen name="SetGoalIntro" component={SetGoalIntro} />
      <Tab.Screen name="SearchUsers" component={SearchUsers} />
    </Tab.Navigator>
  );
};

export default Nav;
