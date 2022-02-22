import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Goals from "../Goals/Goals";
import Social from "../Social/Social";
import PatchGoals from "../PatchGoals/PatchGoals";
import { TouchableOpacity } from "react-native";

export default Feed = () => {
  return (
    <ScrollView style={styles.container}>
      
      
     <PatchGoals></PatchGoals>
     
      <View style={styles.personalWrapper}>
        <Text style={styles.sectionTitle}>Goal Status:</Text>
        {/* <View style={styles.personalGoals}> */}
          {/* <Goals text={"Objective: Run 120km"} progress={0.3} />
          <Goals text={"Objective: Write novella"} progress={0.7} />
          <Goals text={"Objective: Save £800"} progress={0.6} />
          <Goals text={"Objective: Redecorate bedroom"} progress={0.1} /> */}
          <View style={styles.status}>

            </View>
            <View >
            <TouchableOpacity style={styles.takeToCalendar}>
              <Text>See Calendar</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View>
          <Text style={styles.friends}>Friends feed</Text>

          <View>
            <Social
              text={"Michael Higgins: Make countdown app"}
              progress={0.9}
              />
            <Social text={"Andrew Browne: Practice golf"} progress={0.1} />
            <Social text={"Ben Bartram: Make navbar"} progress={0} />
            <Social text={"Joe Valentine: Eat less burritos"} progress={0.5} />
          </View>
        </View>
      {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efbcd9",
  },
  personalWrapper: {
    height: 220,
   borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.6,
shadowRadius: 3.84,

elevation: 5,
  },
  sectionTitle: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  friends: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: 20,
    marginLeft: 10
  },
  status: {
    height: 100,
    width: '100%',
    backgroundColor: '#afca51',
    borderRadius: 5,
    marginTop: 5,
    
  },
  takeToCalendar: {
    height: 50,
    width: '100%',
    backgroundColor: '#de70af',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
