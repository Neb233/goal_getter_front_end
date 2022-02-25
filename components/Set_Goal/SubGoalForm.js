import React, { useState } from "react";
import { StyleSheet, Button, TextInput, View, Text, Switch, KeyboardAvoidingView } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { prodErrorMap } from "firebase/auth";
import { HideableView } from "../../shared/HideableView";


const ReviewSchema = yup.object({
  title: yup.string().required().min(4),
  objective: yup.string().required().min(10),
  start_date: yup.date().required(),
  end_date: yup.date().required()
});

const SubGoalForm = ({ addSubGoal }) => {
  const [hideProgressOptions, setHideProgressOptions] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () =>{
     setIsEnabled(previousState => !previousState)
isEnabled ? setHideProgressOptions(true) : setHideProgressOptions(false)
};
  return (
    
    <KeyboardAvoidingView behavior="padding">
      <Formik
        initialValues={{
          title: "",
          objective: "",
          start_date: "",
          end_date: "",

        }}
        onSubmit={(values) => {
          addSubGoal(values);
        }}
        validationSchema={ReviewSchema}
      >
        {(props) => (
          <View>
           
            <View style={styles.container}>
            
            <TextInput
              style={styles.input}
              multiline
              
              placeholder="SubGoal Title"
              onChangeText={props.handleChange("title")}
              value={props.values.title}
            />
             
            </View>
            <Text style={styles.errorText}>
              {props.touched.title && props.errors.title}
            </Text>
            
            
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
{/* <View style={styles.switchcontainer}> */}
  {/* <Text>Set Numerical Values</Text> */}
<Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        
      />
      {/* </View> */}

             <HideableView hidden={hideProgressOptions}>
            
             <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Target Value"
                    onChangeText={props.handleChange("target_value")}
                    value={props.values.target_value}
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
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>

     
    </KeyboardAvoidingView>
   
 
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    
borderColor: "black",
borderRadius:10
  },
  switchcontainer: {
    flex: 1,
    flexDirection: "column"
  }
});

export default SubGoalForm;
