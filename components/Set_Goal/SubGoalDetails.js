import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

const SubGoalDetails = ({ subGoals, setSubGoals, item, setSubGoalDetailModalOpen }) => {

    const deleteSubGoal = (subgoal_id) => {
const newSubGoals = subGoals.map((subgoal) => {
    return { ...subgoal }
})
setSubGoals(newSubGoals.filter((subgoal) => {
    return subgoal.subgoal_id != subgoal_id
}))
setSubGoalDetailModalOpen(false)
    }
  return (
    <View>
      <Text>{item.objective}</Text>
      <View>
          <Button title="Delete SubGoal"
          onPress={()=>{deleteSubGoal(item.subgoal_id)}}></Button>
      </View>
    </View>
    
  )
}

export default SubGoalDetails

const styles = StyleSheet.create({})