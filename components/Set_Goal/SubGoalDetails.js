import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

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
    <View>
      <Text>{item.objective}</Text>
      <View>
          <Button title="Delete SubGoal"
          onPress={()=>{deleteSubGoal(item.objective)}}></Button>
      </View>
    </View>
    
  )
}

export default SubGoalDetails

const styles = StyleSheet.create({})