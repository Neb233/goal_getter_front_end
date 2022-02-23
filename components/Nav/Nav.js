import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationHelpersContext } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';
import Feed from '../Feed/Feed';
import SetGoal from '../Set_Goal/SetGoal';
import Social from '../Social/Social';
import Calender from '../Calender/Calender';


const Tab = createBottomTabNavigator();

const Nav = ({navigation}) => {
    return (
      
            
            <Tab.Navigator initialRouteName='Feed' options={{ headerShown: false}}>
             
            <Tab.Screen name='Feed' component={Feed} />
           <Tab.Screen name='SetGoal' component={SetGoal} />
           <Tab.Screen name='Social' component={Social} />
           <Tab.Screen name='Calender' component={Calender} />
          </Tab.Navigator>
            )
          }  


export default Nav;