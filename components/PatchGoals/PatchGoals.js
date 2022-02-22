import React from "react";
import { StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import { FlatList } from "react-native-web";
import Goals from "../Goals/Goals";

const PatchGoals = () => {
  return (
    <View style={styles.cont}>
      <Text style={styles.text}>Current goals:</Text>
{/* pagingEnabled={true} */}
      <ScrollView horizontal={true} >
        <View style={styles.page}>
            <Text style={styles.pageText}>Goal 1</Text>
        </View>
        <View style={styles.page}>
        <Text style={styles.pageText}>Goal 2</Text>
        </View>
        <View style={styles.page}>
        <Text style={styles.pageText}>Goal 3</Text>
        </View>
        <View style={styles.page}>
        <Text style={styles.pageText}>Goal 4</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PatchGoals;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "white",
    height: 400,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    padding: 10,
    fontSize: 24,
    fontWeight: 'bold'
  },
  page: {
    height: 340,
    width: 335,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#afca51",
    borderRadius: 5
  },
  pageText: {
    padding: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  }
});
