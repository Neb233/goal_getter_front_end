import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/Login/LoginScreen';
import HomeScreen from './components/Login/HomeScreen';
import RegisterScreen from './components/Login/RegisterScreen';
import Feed from './components/Feed/Feed';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen  name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});