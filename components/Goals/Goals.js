import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';


const Goals = (props) => {

    return (
        <View>

        <View style={styles.goalContainer}>
            <Text style={styles.goalInfo}>{props.text}</Text>
            <Progress.Bar style={styles.progress} progress={props.progress} width={300} />
            <View style={styles.interact}>
            <Text style={styles.descrip}>Description</Text>
            <Text style={styles.update}>Update</Text>
            <Text style={styles.update}>SubGoals</Text>
            </View> 
        </View>

        </View>
    )
}
export default Goals;





const styles = StyleSheet.create({
    goalContainer: {
        padding: 15,
        backgroundColor: '#d3d4d6',
        borderRadius: 10,
        marginTop: 10
    },
goalInfo: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00950b'
},
squares: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00950b'
},
progress: {
    marginTop: 10
},
interact: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-evenly',
paddingTop: 10
},
descrip: {
    paddingTop: 10
},
update: {
    paddingTop: 10
}
})