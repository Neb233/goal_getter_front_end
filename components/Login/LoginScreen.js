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

import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "@firebase/auth";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";

import * as Yup from "yup";

const LoginScreen = () => {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const navigation = useNavigation();

  // const handleSignIn = () => {
  //     signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //         const user = userCredential.user
  //         navigation.navigate('Feed')
  //         console.log('Logged in with:', user.email)
  //     })
  //     .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //     })
  // }

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const valSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(4, "Password shoudl be more than 4 chars")
      .max(10, "Password should not exceed 10 chars")
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .required(),
  });

  return (
    <View style={styles.inputContainer}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={valSchema}
        onSubmit={(values) =>
          signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
              const user = userCredential.user;

              navigation.navigate("Nav", { screen: "Feed" });
              return user;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            })
        }
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <KeyboardAvoidingView style={styles.container} behaviour="padding">
            <View style={styles.titleText}>
              <Text>GoalGetter?</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                id="email"
                name="email"
                placeholder="email"
                value={values.email}
                onChange={handleChange("email")}
                style={styles.input}
              />
              <Text>{touched.email && errors.email}</Text>
              <TextInput
                id="password"
                name="password"
                placeholder="password"
                value={values.password}
                onChange={handleChange("password")}
                style={styles.input}
                secureTextEntry
              />
              <Text>{touched.password && touched.email}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.registerText}>
              <Text>Want to be a GoalGetter?</Text>

              <TouchableOpacity
                onPress={handleRegister}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text>Register Here </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    padding: 20,
  },

  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  registerText: {
    padding: 20,
  },
});
