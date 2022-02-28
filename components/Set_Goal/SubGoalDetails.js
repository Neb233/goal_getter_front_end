import { StyleSheet, Text, View, Button, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Formik, useField } from "formik";
import { ScrollView } from 'react-native-web';
import dateFormat from 'dateformat';

const SubGoalDetails = ({ subGoals, setSubGoals, item, setShowSubGoalDetails, showSubGoalDetails }) => {

    const deleteSubGoal = (objective) => {
const newSubGoals = subGoals.map((subgoal) => {
    return { ...subgoal }
})

setSubGoals(newSubGoals.filter((subgoal) => {
    return subgoal.objective != objective
}))
setShowSubGoalDetails((showSubGoalDetails) => {
    const newState = showSubGoalDetails.map(() => {
      return false;
    });
    return newState;
  });
    }
    
  return (

    <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', marginTop:20, marginBottom: 20}} behavior="padding" enabled   keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.fieldcontainer}>
          <Text style={styles.title}>Objective</Text>
      <Text style={styles.value}>{item.objective}</Text>
      </View>
      <View style={styles.fieldcontainer}>
          <Text style={styles.title}>End date</Text>
      <Text style={styles.value}>{dateFormat(item.end_date, "dddd dS mmmm yyyy")}</Text>
      </View>
      {item.target_value != null && item.unit != null ? 
      
      <View style={styles.fieldcontainer}>
      <Text>Target</Text>
  <Text style={styles.value}>{item.target_value}{" "}{item.unit}</Text>
  </View>
  : null
      }
      <View>
          <Button title="Delete SubGoal"
          onPress={()=>{deleteSubGoal(item.objective)}}></Button>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
    
  )
}

export default SubGoalDetails

const styles = StyleSheet.create({
  fieldcontainer: {
    flex:1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    backgroundColor:"red",
    padding:5

  },
  value: {
marginLeft: 100
  },
  title: {
fontWeight:"bold"
  }
})