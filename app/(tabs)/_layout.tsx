import { StyleSheet, Text, View } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome"
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import { Colors } from "../../constants/Colors"

const HomeLayout = () => {
  return (
    <>
      {/* <Stack>
      <Stack.Screen name='home' options={{headerShown:false}} />
      <Stack.Screen name='create' options={{headerShown:false}} />
      <Stack.Screen name='profile' options={{headerShown:false}} />
      <Stack.Screen name='clothDetails' options={{headerShown:false}} />
    </Stack> */}
      <Tabs screenOptions={{ tabBarStyle:{height:"auto", alignContent:"center", borderTopRightRadius:10, borderTopStartRadius:10},
       headerShown: false, 
       tabBarActiveTintColor: Colors.light.cyan,
        tabBarAllowFontScaling: true, 
        tabBarItemStyle:{alignSelf:"center", marginVertical:6},
        tabBarIconStyle:{marginBottom:6}
        }}>
        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => <FontAwesome size={28} name="home" color={color} focused={focused} />
          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: "create",

            tabBarIcon: ({ color }) => <FontAwesome size={28} color={color} name="plus-square" />
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: "Profile",

            tabBarIcon: ({ color }) => <FontAwesome size={28} color={color} name="user-circle" />
          }}
        />

        <Tabs.Screen
          name='clothDetails'
          options={{
            href: null
          }}
        />
      </Tabs>



    </>
  )
}

export default HomeLayout

const styles = StyleSheet.create({})