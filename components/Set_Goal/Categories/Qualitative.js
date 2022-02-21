import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Modal, SafeAreaView, Pressable } from 'react-native'
import React, { useState } from 'react'
import Card from '../../../shared/card'
import MaterialIcon, {colorPalette} from 'material-icons-react';

const Qualitative = ({ navigation }) => {
  const [modalOpen, setModalOpen] = useState(false)
const [subGoals, setSubGoals] = useState([{title: "Learn F Major Chord", objective: "Learn where to put fingers on fretbaord", start_date:"12/04/2022", end_date:"13/04/2022", type:"music", status:"in progress", owner: "Bob"}, {title: "Learn C Major",objective: "Learn where to put fingers on fretboard + transition from F to C", start_date:"12/04/2022", end_date:"13/04/2022", type:"music", status:"in progress", owner: "Bob"}])

  return (
    <SafeAreaView>
       <Button title="Return"
      onPress={() => navigation.navigate("SetGoal")}></Button>
      <Modal visible={modalOpen}
      animationType="slide">
<View>
<Pressable
       onPress={() => {setModalOpen(false)}}><MaterialIcon
      icon="close"
      size={24}
      /></Pressable>
  <Text>In the modal</Text>
</View>
      </Modal>
   
      <Text>Qualitative</Text>
      <Text>Subgoals:</Text>
      <FlatList
      data={subGoals}
      renderItem={({ item }) => (
        <TouchableOpacity>
        <Card>
        <Text>{item.title}</Text>
        </Card>
      </TouchableOpacity>
      
      )}
      />
      <Pressable
       onPress={() => {setModalOpen(true)}}><MaterialIcon
      icon="add"
      size={24}
      style={styles.modalToggle}
      /></Pressable>
      


  
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 10,
    alignSelf:"center"
  }
})


export default Qualitative

