import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'






//import logged in user context later

const Setgoal = ({ navigation }) => {
  return (
    <View>
        <Text>Select Goal type:</Text>
      <Button title="Quantitative"
      onPress={() => navigation.navigate("Quantitative")}></Button>
      <Button title="Qualitative"
      onPress={() => navigation.navigate("Qualitative")}></Button>
    </View>

   
  )
  

}

export default Setgoal