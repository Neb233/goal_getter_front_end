import { View, StyleSheet } from 'react-native'
import React from 'react'


const Card = (props) => {
  return (

    <View style={styles.card}>
   

    <View style={styles.cardContent}
    >
        { props.children }
 
  </View>
  </View>
  
  )
}

const styles = StyleSheet.create({
    card: {
borderRadius: 6,
elevation: 3,
backgroundColor: "#F5A623",
shadowOffset: { width: 1, height: 1 },
shadowOpacity: 0.3,
marginHorizontal: 4,
marginVertical: 6
    },
    cardContent: {
marginHorizontal:10,
marginVertical: 10
    }
})
export default Card