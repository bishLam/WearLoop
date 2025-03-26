import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

import UserProvider from '@/contexts/UserAuth'

const RootLayout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(account)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' options={{ headerShown: false }} />

      </Stack>
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})