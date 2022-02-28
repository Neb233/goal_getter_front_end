import React, { useState } from "react";
import { StyleSheet, Button, TextInput, View, Text, Switch, KeyboardAvoidingView, ScrollView } from "react-native";
import { Formik, useField } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { prodErrorMap } from "firebase/auth";
import { HideableView } from "../../shared/HideableView";


const ReviewSchema = yup.object({
 
  objective: yup.string().required().min(10),
  start_date: yup.date(),
  end_date: yup.date(),
  target_value: yup.number(),
  unit: yup.string()
});

const SubGoalForm = ({ addSubGoal, setShowSubGoalDetails }) => {
  const [hideProgressOptions, setHideProgressOptions] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () =>{
     setIsEnabled(previousState => !previousState)
isEnabled ? setHideProgressOptions(true) : setHideProgressOptions(false)
};

  return (
    
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column'}} behavior="padding" enabled   keyboardVerticalOffset={100}>
      <Formik
        initialValues={{
         
          objective: "",
          start_date: "",
          end_date: "",
          target_value: 0,
          unit: ""

        }}
        onSubmit={(values) => {
          addSubGoal(values);
        }}
        validationSchema={ReviewSchema}
      >
        {(props) => (
          <ScrollView>
         
            
            
            <View style={styles.container}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Objective"
              onChangeText={props.handleChange("objective")}
              value={props.values.objective}
            />
           
            </View>
            <Text style={styles.errorText}>
              {props.touched.objective && props.errors.end_date}
            </Text>


            <DatePicker 
            name="start_date"/>
            <Text style={styles.errorText}>
              {props.touched.start_date && props.errors.start_date}
            </Text>

            <DatePicker
             name="end_date" />
<View style={styles.switchcontainer}>
  <Text>Set Numerical Values</Text>
<Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={styles.switch}
        
      />
      </View>

             <HideableView hidden={hideProgressOptions}
             style={styles.HideableView}>
            
             <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Target Value"
                    type="number"
                    onChangeText={
                      props.handleChange("target_value")
                    }
                    value={props.values.target_value}
                    keyboardType="numeric"
                  
                  />
                  <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Units"
                    onChangeText={props.handleChange("unit")}
                    value={props.values.unit}
                  />
               
             </HideableView>

            <Button
              title="Add SubGoal"
              color="maroon"
             
              onPress={   
                props.handleSubmit
              }
            />
          </ScrollView>
        )}
      </Formik>

     
    </KeyboardAvoidingView>
   
 
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: "row",
    // padding: 5,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    marginTop:20,
    marginBottom: 20



  },
  switchcontainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20
   
  },
  switch: {
marginLeft: 180
  },
  HideableView: {
    marginTop: 20,
    marginBottom: 20
  },
  addsubgoalbutton: {
    marginTop: 20
  }
});

export default SubGoalForm;
