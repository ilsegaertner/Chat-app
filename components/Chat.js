import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const Chat = ({ navigation, route, db }) => {
  const { user, background } = route.params;
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

  // set the messages
  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Hello Developer",
  //       createdAt: new Date(),
  //       user: {
  //         id: 2,
  //         name: "React native",
  //         avatar: "https://loremflickr.com/320/240/dog",
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: "You are in the chatroom",
  //       createdAt: new Date(),
  //       system: true,
  //     },
  //   ]);
  // }, []);

  useEffect(() => {
    navigation.setOptions({ title: user });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
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
