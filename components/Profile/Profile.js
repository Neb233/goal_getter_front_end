import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth } from '../../firebase'
import axios from 'axios'
import { getUser } from '../../utils/api'



const Profile = () => {

    const [proPage, SetproPage] = useState('')
    const [details, Setdetails] = useState({})

    const user = auth.currentUser;
    const displayName = user.displayName

    useEffect(() => {
      getUser(displayName).then((res) => {
        Setdetails(res[0])
      })
    }, [])
    
   
   
    
      
      

    
    return (
        <View>
          <Text style={styles.titleText}>{details.username}</Text>
        
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    
  }
})