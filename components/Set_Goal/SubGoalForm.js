import React from "react";
import { StyleSheet, Button, TextInput, View, Text } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import DatePicker from "../../shared/DatePicker";
import { prodErrorMap } from "firebase/auth";


const ReviewSchema = yup.object({
  title: yup.string().required().min(4),
  objective: yup.string().required().min(10),
  start_date: yup.date().required(),
  end_date: yup.date().required()
});

const SubGoalForm = ({ addSubGoal }) => {
  return (
    
    <View>
      <Formik
        initialValues={{
          title: "",
          objective: "",
          start_date: "",
          end_date: ""
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

            <Button
              title="Add SubGoal"
              color="maroon"
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>

     
    </View>
   
 
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
  }
});

export default SubGoalForm;
