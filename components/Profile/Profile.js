import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth } from '../../firebase'
import axios from 'axios'
import { getUser } from '../../utils/api'



const Profile = () => {

    const [proPage, SetproPage] = useState('')
    const [details, Setdetails] = useState({})

    const user = auth.currentUser;
    const displayName = 'RW'

    useEffect(() => {
      getUser(displayName).then((res) => {
        console.log(res)
      })
    })
    
   
   
    
      
      

    
    return (
        <View>
          <Text>Hello</Text>
         {   console.log(displayName) }
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})