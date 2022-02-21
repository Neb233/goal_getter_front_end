import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Goals from "../Goals/Goals";
import Social from '../Social/Social';

export default Feed = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.personalWrapper}>
          <Text style={styles.sectionTitle}>Personal Goals</Text>
        <View style={styles.personalGoals}>
            <Goals text={"Objective: Run 120km"} progress={0.3}/>
            <Goals text={"Objective: Write novella"} progress={0.7}/>
            <Goals text={"Objective: Save £800"} progress={0.6}/>
            <Goals text={"Objective: Redecorate bedroom"} progress={0.1}/>
        </View>
        <View>
        <Text style={styles.friends}>Friends Goals</Text>
       
        <View>
            <Social text={'Michael Higgins: Make countdown app'} progress={0.9}/>
            <Social text={'Andrew Browne: Practice golf'} progress={0.1}/>
            <Social text={'Ben Bartram: Make navbar'} progress={0}/>
            <Social text={'Joe Valentine: Eat less burritos'} progress={0.5}/>
        </View>
      </View> 
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
    },
    personalWrapper: {
        padding: 80,
        paddingHorizontal: 20,
    },
sectionTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
},
friends: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 20
},
})
