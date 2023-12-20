import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  const auth = getAuth();
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          user: user,
          background: background,
        });
        // Alert.alert("Signed In Successfully!");
        Alert.alert(`Hi ${user}. You are now successfully signed in.`);
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, please try again later.");
      });
  };

  const [user, setUser] = useState("");
  const [background, setBackground] = useState("");
  const image = require("../assets/background-image.png");

  // Update the background color when a button is pressed
  const handleBackgroundChange = (color) => {
    setBackground(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.heading}>Chat App</Text>
        <View style={styles.formInput}>
          <TextInput
            style={styles.textInput}
            value={user}
            placeholder="Your Username"
            onChangeText={setUser}
          />

          <View style={styles.backgroundColorButtonWrapper}>
            <Text style={styles.chooseBackgroundColor}>
              Choose Background Color
            </Text>
            <View style={styles.backgroundColorButtonsOnly}>
              <TouchableOpacity
                style={styles.backgroundColorButton1}
                onPress={() => handleBackgroundChange("#090C08")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.backgroundColorButton2}
                onPress={() => handleBackgroundChange("#474056")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.backgroundColorButton3}
                onPress={() => handleBackgroundChange("#8A95A5")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.backgroundColorButton4}
                onPress={() => handleBackgroundChange("#B9C6AE")}
              ></TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.enterButton} onPress={signInUser}>
            <Text style={styles.buttonText}>Enter chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  heading: {
    flex: 2,
    fontSize: 45,
    color: "white",
    fontWeight: "600",
    paddingTop: 60,
    textAlign: "center",
  },
  formInput: {
    alignItems: "stretch",
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    minHeight: "44%",
  },

  textInput: {
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    textAlign: "center",
  },
  chooseBackgroundColor: {
    fontSize: 16,
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: "300",
    color: "#757083",
  },

  backgroundColorButtonsOnly: {
    flexDirection: "row",
    paddingVertical: 20,
    marginTop: 0,
  },

  backgroundColorButton1: {
    width: 40,
    height: 40,
    backgroundColor: "#090C08",
    borderRadius: 20,
    marginRight: 10,
  },

  backgroundColorButton2: {
    width: 40,
    height: 40,
    backgroundColor: "#474056",
    borderRadius: 20,
    marginRight: 10,
  },

  backgroundColorButton3: {
    width: 40,
    height: 40,
    backgroundColor: "#8A95A5",
    borderRadius: 20,
    marginRight: 10,
  },

  backgroundColorButton4: {
    width: 40,
    height: 40,
    backgroundColor: "#B9C6AE",
    borderRadius: 20,
    marginRight: 10,
  },

  enterButton: {
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginTop: 12,
    backgroundColor: "#757083",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default Start;
