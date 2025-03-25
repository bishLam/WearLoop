import React, { useEffect, useRef } from 'react';
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

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProfileSlider = ({ visible, onClose, onLogout }: Props) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Animate in and out from right to left
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
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
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
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
