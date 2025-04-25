import { StyleSheet, Text, View, Image } from 'react-native'
import FontAwesome5Brands from "@expo/vector-icons/FontAwesome"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import { Colors } from "../../constants/Colors"


const HomeLayout = () => {
  return (
    <>
      <Tabs backBehavior='history' screenOptions={{
        tabBarStyle: { height: 70, alignContent: "center", borderTopRightRadius: 10, borderTopStartRadius: 10 },
        headerShown: false,
        tabBarActiveTintColor: Colors.light.cyan,
        tabBarAllowFontScaling: true,
        tabBarItemStyle: { alignSelf: "center", marginVertical: 6 },
        tabBarIconStyle: { marginBottom: 6 }
      }}>
        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => <FontAwesome5Brands size={28} name="home" color={color} focused={focused} />
          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: "create",

            tabBarIcon: ({ color }) => <FontAwesome5Brands size={28} color={color} name="plus-square" />
          }}
        />

        <Tabs.Screen
          name='messenger'
          options={{
            title: "Messeges",

            tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} color={color} name="facebook-messenger" />,
          }}
        />


        <Tabs.Screen
          name='clothDetails'
          options={{
            href: null
          }}
        />

        <Tabs.Screen
          name='individualChat'
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