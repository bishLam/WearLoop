import { StyleSheet} from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

import UserProvider from '@/contexts/UserAuth'

const AccountLayout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name='profile' options={{ headerShown: false }} />
        <Stack.Screen name='editProfile' options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  )
}

export default AccountLayout


const styles = StyleSheet.create({})