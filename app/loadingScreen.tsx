import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const LoadingScreen = () => {
  return (
      <ScrollView contentContainerStyle = {
        {
          alignContent: "center",
          justifyContent:"center",
          flex:1
        }
      }>
        <ActivityIndicator color={Colors.light.lime} size={"large"} style={{
          alignSelf:"center",
        }} />
      </ScrollView>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({})