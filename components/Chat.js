import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";

const Chat = ({ navigation, route, db, isConnected, storage }) => {
  const { user, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  // append the new messages to the old ones
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // define the individual style of the bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    else return null;
  };

  let unsubMessages; // If you leave let unsubShoppinglists in useEffect(), you’ll lose the reference to the old unsubscribe function. This is because re-initializing any kind of listener doesn’t override and remove the old listener, it only removes the reference to that old listener, while keeping it alive somewhere in the memory without a way of reaching it, resulting in a memory leak.

  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      navigation.setOptions({ title: user });
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Cleanup code
    return () => {
      if (unsubMessages) unsubMessages(); // This invocation is meant to stop listening to changes in the Firestore collection initiated by the onSnapshot call earlier in the useEffect. It's not a traditional unsubscribe, but rather a way to stop the listening process initiated by onSnapshot.
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    // AsyncStorage methods are async and you will use await with them, so you can't use them straight away inside the useEffect() of the ShoppingLists component
    const cachedMessages = (await AsyncStorage.getItem("messages")) || []; // "|| []" will assign an empty array to cachedLists in case AsyncStorage.getItem("shopping_lists") fails when the shopping_lists item hasn’t been set yet in AsyncStorage
    setMessages(JSON.parse(cachedMessages));
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // function for all actions and menu options that are defined in the CustomActions component
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  // create own custom view for rendering a map in a chat bubble
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        // MapView component to render a map in the view.
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          username: user,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
