import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context'

const Create = () => {
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

export default Create

const styles = StyleSheet.create({
  mainContainer : {

  }
})