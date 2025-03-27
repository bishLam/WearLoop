import { Keyboard, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

import UserProvider from '@/contexts/UserAuth'
import { canGoBack, goBack } from 'expo-router/build/global-state/routing'

const RootLayout = () => {
  return (
    <UserProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <Stack>
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='(account)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' options={{ headerShown: false }} />
        </Stack>
      </TouchableWithoutFeedback>
      <StatusBar backgroundColor="gray"
        barStyle="light-content"
      />
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})