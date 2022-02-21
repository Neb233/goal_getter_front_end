import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

const Social = (props) => {

    return (
        <View style={styles.goalContainer}>
            <Text style={styles.goalInfo}>{props.text}</Text>
            <Progress.Bar style={styles.progress} progress={props.progress} width={300} />
            <View style={styles.interact}>
            <Text style={styles.descrip}>Congratulate</Text>
            <Text style={styles.update}>Comment</Text>
            <Text style={styles.update}>Details</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
sectionTitle: {
    color: '#00ffdd',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
},
    goalContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10
    },
goalInfo: {
    color: 'black',
    marginBottom: 15,
    fontWeight: 'bold'
},
progress: {
    marginTop: 10
},
interact: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-evenly',
paddingTop: 15,
},
descrip: {
    padding: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
},
update: {
    padding: 4,
    
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
}
})

export default Social;

