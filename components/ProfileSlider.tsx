import React, { useEffect, useRef, useState } from 'react';
import { defaultImage } from '@/constants/defaultImage';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  Image
} from 'react-native';
import { router } from 'expo-router';

import { useUser } from '@/contexts/UserAuth';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { generateProfilePictureLink, getUserDetailsFromEmail } from '@/lib/appwriteFunctions';


type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};


const SCREEN_WIDTH = Dimensions.get('window').width;

const ProfileSlider = ({ visible, onClose, onLogout }: Props) => {
  const userAuth = useUser();
  const [userImage, setUserImage] = useState("")

  let user = userAuth?.current?.email!
  useEffect(() => {
     const getUserImage = async () => {
      const  userDetails = await getUserDetailsFromEmail(user)
      const userProfileLink = await generateProfilePictureLink(userDetails?.profilePictureID)
      setUserImage(userProfileLink)
     }
     getUserImage()
  }, [user])


  const handleSliderButtonPress = async (buttonName: string) => {
    if (buttonName === "profile") {
      router.push("/profile")
      onClose()
      return
    }

    if (buttonName === "settings" || buttonName === "rateUs" || buttonName === "notifications") {
      router.push("/+not-found")
      onClose()
      return
    }
    if (buttonName === "home") {
      router.push("/")
      onClose()
      return
    }

    if (buttonName === "logout") {
      await userAuth?.logout();
      onClose()
      return
    }
  }


  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Animate in and out from right to left
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Tap outside to close the modal */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >

          {/* Logout Button */}
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: userImage }}/>
          </View>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("home")}>
          <Feather name="home" size={24} color="black" />
            <Text style={styles.otherText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("profile")}>
          <Feather name="user" size={24} color="black" />
            <Text style={styles.otherText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("settings")}>
          <Feather name="settings" size={21} color="black" />
            <Text style={styles.otherText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("notifications")}>
          <Ionicons name="notifications-outline" size={24} color="black" />
            <Text style={styles.otherText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("rateUs")}>
          <Feather name="star" size={24} color="black" />
            <Text style={styles.otherText}>Rate us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: "transparent" }]} onPress={() => handleSliderButtonPress("logout")}>
          <MaterialIcons name="logout" size={24} color="red" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>


        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ProfileSlider;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', // keep drawer anchored to right
  },
  drawer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    elevation: 5,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    paddingRight: 34
  },
  imageContainer: {
    // alignSelf:"center",
    paddingVertical: 30
  },
  image: {
    height: 100,
    width: 100,
    borderRadius:50
  },

  otherButtons: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    // justifyContent:"center",
    gap: 10,
    width: "100%"
  },
  logoutBtn: {
    // backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    // justifyContent:"center",
    flexDirection: "row",
    gap: 10,
width: "100%"
  },

  otherText:{
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',

  },

});
