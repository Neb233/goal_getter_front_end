import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';


const Goals = (props) => {

    return (
        <View>

        <View style={styles.goalContainer}>
            <Text style={styles.goalInfo}>{props.text}</Text>
            <Progress.Bar style={styles.progress} progress={props.progress} width={200} />
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
        flex: 1,

        padding: 50,
        backgroundColor: '#f8e2ef',
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.6,
shadowRadius: 3.84,

elevation: 5,
    },
goalInfo: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00950b',
    alignItems: 'center',
    justifyContent: 'center'

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