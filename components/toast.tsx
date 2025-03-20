import { Alert, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React from 'react'


const Toast = (message:string) => {

  if(Platform.OS === "android"){
    ToastAndroid.show(message, ToastAndroid.LONG)
  }

  else if(Platform.OS === "ios"){
    Alert.alert(message)
  }

}

export default Toast
