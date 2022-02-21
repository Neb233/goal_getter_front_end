import { TouchableOpacity,
    KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword,  onAuthStateChanged } from '@firebase/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

const navigation = useNavigation()

useEffect(() => {
  let unsubscribe =  onAuthStateChanged(auth, (user) => {
        if (user) {
            navigation.navigate('Home')
        }
    })
    unsubscribe;
}, [])



const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
        const user = userCredentials.user
        console.log('registered with email:', user.email)
    })
    .catch(error => alert(error.message))
}

  return (
   <KeyboardAvoidingView
   styles={styles.container}
   behaviour='padding'>
       <View style={styles.inputContainer}>
           <TextInput
           placeholder='email'
           value={email}
           onChangeText={text => setEmail(text)}
           style={styles.input}
           ></TextInput>
           <TextInput
           placeholder='password'
           value={password}
           onChangeText={text => setPassword(text)}
           style={styles.input}
           secureTextEntry
           ></TextInput>

       </View>


<View style={styles.buttonContainer}>
    <TouchableOpacity
    onPress={handleSignUp}
    style={styles.button}
    >
        <Text>Sign Up</Text>
    </TouchableOpacity>

</View>
   </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
     padding: 20
    },
 
 inputContainer: {
        width: '80%'
    },
 input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
 
 },
     
 buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
 },
 button:{
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
 },
 buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
 },
 buttonOutline:{
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
 },
 buttonOutlineText:{
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
 
 },
 registerText: {
     padding: 20,
 }
 
 })