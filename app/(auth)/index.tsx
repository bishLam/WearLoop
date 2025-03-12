import { StyleSheet, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  } from 'react-native'

const Login = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style = {styles.mainContainer}>
          <Text>Log in Page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  mainContainer : {
    // flex:1,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }
})