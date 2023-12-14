// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";

import Start from "./components/Start.js";
import Chat from "./components/Chat.js";
import { Alert, LogBox } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

//create the navigator
const Stack = createNativeStackNavigator();

// ignores error Message in Welcome Screen
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBAf5BHbFzO60Mj-e77up6UJ3Ele7Py7zk",
    authDomain: "chat-app-cc409.firebaseapp.com",
    projectId: "chat-app-cc409",
    storageBucket: "chat-app-cc409.appspot.com",
    messagingSenderId: "307426839137",
    appId: "1:307426839137:web:a3166210656d4cffd77820",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
          {/* Using {...props} ensures that not only the db prop but also other relevant navigation-related props are passed to the Chat component. <Stack.Screen name="Chat" component={Chat} wouldnt pass the db props */}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
