import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import * as Animatable from "react-native-animatable";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const handleLogin = () => {
    valSchema
      .isValid({
        email: email,
        password: password,
      })
      .then((valid) => {
        if (valid) {
          signInWithEmailAndPassword(auth, email, password).then(
            (userCredentials) => {
              const user = userCredentials.user;
              navigation.navigate("Feed");
              return user;
            }
          );
        }
      });
  };

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
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light" />
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
              value={email}
              onChangeText={(text) => SetEmail(text)}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <Text style={styles.text_footer}>Password</Text>
            <TextInput
              id="password"
              name="password"
              value={password}
              onChangeText={(text) => SetPassword(text)}
              style={styles.textInput}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
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
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf9e6",
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    marginTop: 50,
    color: "#5b72a4",
  },
  footer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  text_header: {
    color: "#3e4d6e",
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
    backgroundColor: "#3e4d6e",
    alignItems: "flex-start",
    marginTop: 30,
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
    marginBottom: -10,
  },
});
