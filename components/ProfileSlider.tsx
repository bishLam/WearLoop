import React, { useEffect, useRef } from 'react';
import { Colors } from "../constants/Colors"
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

import { useUser } from '@/contexts/UserAuth';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};


const SCREEN_WIDTH = Dimensions.get('window').width;

const ProfileSlider = ({ visible, onClose, onLogout }: Props) => {

  const userAuth = useUser();
  const handleSliderButtonPress = async (buttonName: string) => {
    if (buttonName === "profile") {
      router.replace("/profile")
      return
    }

    if (buttonName === "settings" || buttonName === "rateUs") {
      router.replace("/+not-found")
      return
    }

    if (buttonName === "logout") {
      await userAuth?.logout();
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
          {/* Header Row with Back Button */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <FontAwesome name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: Colors.light.lime }]} onPress={() => handleSliderButtonPress("profile")}>
            <Text style={styles.logoutText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: Colors.light.lime }]} onPress={() => handleSliderButtonPress("settings")}>
            <Text style={styles.logoutText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.otherButtons, { backgroundColor: Colors.light.lime }]} onPress={() => handleSliderButtonPress("rateUs")}>
            <Text style={styles.logoutText}>Rate us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: "red" }]} onPress={() => handleSliderButtonPress("logout")}>
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
    width: '70%',
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
  },
  otherButtons: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center"
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
