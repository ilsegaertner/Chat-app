import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  // action menu "ActionSheet". Comes with the @expo/react-native-action-sheet module
  const actionSheet = useActionSheet();

  // displaying the ActionSheet menu
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      }
    );
  };

  // const newUploadRef = ref(storage, "image123"); //  To upload a file, you have to prepare a new reference for it on the Storage Cloud

  // generating an unique reference string for uploading pictures to firestore
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob(); // A Blob (Binary Large Object) is a type of data structure used to store binary data.
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      // uploadBytes() is a method from "firebase/storage" to upload the file.
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  // Sending images from media library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      //  The propert you want to check from the returned object is .granted, which is a boolean.
      let result = await ImagePicker.launchImageLibraryAsync();
      // specify media format with: let result = await launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });

      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Taking an image and sending it
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // let MediaLibraryPermissions =
      //   await MediaLibrary.requestPermissionsAsync();
      // if (MediaLibraryPermissions?.granted)
      //   await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      // setImage(result.assets[0]);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Optaining, displaying and sharing location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occured while fetching location");
    } else Alert.alert("Permissions have not been granted.");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
