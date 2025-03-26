import { Link, router, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const handleOnClick = () => {
  router.dismissTo("/+not-found")
  router.replace("/")
}


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={{ color: "black", fontWeight: 800, textAlign: "center", fontSize: 30 }}>We are sorry. This screen is currently under maintainence. Please check this page back later</Text>
        <TouchableOpacity onPress={handleOnClick} style={styles.link}>
          <Text style={{ color: "white", fontWeight: 800 }}>Go to home screen!</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "red",
    borderRadius: 6,
    paddingHorizontal: 20
  },
});
