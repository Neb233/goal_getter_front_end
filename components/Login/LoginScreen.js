import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/user";
import { StatusBar } from "expo-status-bar";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";

import * as Yup from "yup";
import * as Animatable from "react-native-animatable";

const LoginScreen = () => {
  
  
const navigation = useNavigation();

// const handleTest = (values) => {
//   navigation.navigate("Profile")

// }


  const valSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(4, "Password shoudl be more than 4 chars")
      .max(10, "Password should not exceed 10 chars")
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .required("Required"),
  });

  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light" />

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={valSchema}
        onSubmit={(values) => {
          
         
          signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredentials) => {
              const user = userCredentials.user;
              navigation.navigate("Profile")
              return user
              
            })
           
            
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <KeyboardAvoidingView behaviour="padding">
            <View style={styles.header}>
              <Text style={styles.text_header}>Welcome Back</Text>
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
              <View style={styles.action}>
                <Text style={styles.text_footer}>Email</Text>
                <TextInput
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  style={styles.textInput}
                />
                <Text style={styles.errorMsg}>
                  {touched.email && errors.email}
                </Text>
              </View>

              <View style={styles.action}>
                <Text style={styles.action}>Password</Text>
                <TextInput
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange("password")}
                  style={styles.textInput}
                  secureTextEntry
                />
                <Text style={styles.errorMsg}>
                  {touched.password && touched.email}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.register_text}>
                  Don't have an account? Click to create one
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("RegisterScreen")}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    // flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    marginTop: 50,
  },
  footer: {
    // flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "column",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },

  textInput: {
    padding: 5,
    color: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  buttonContainer: {
    paddingBottom: 400,
    width: "80%",
  },
  button: {
    backgroundColor: "#009387",
    alignItems: "flex-start",
    marginTop: 40,
    padding: 15,
    borderRadius: 10,
    marginBottom: 60,
    textAlign: "center",
    zIndex: 1,
    elevation: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  register_text: {
    marginTop: 20,
  },
});
