import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { router } from 'expo-router'

const Messeges = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: "5%" }}>
        <View style={styles.headerContainer}>
          <View style={styles.leftHeaderContainer}>
            <TouchableOpacity style={styles.backButton}
              onPress={() => router.replace("/home")}
            >
              <AntDesign name="arrowleft" size={34} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Messages</Text>
          </View>

          <View style={styles.rightHeaderContainer}>
            <Ionicons name="search" size={24} color="black" />
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Messeges

const styles = StyleSheet.create({

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  leftHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap:20
  },

  rightHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: "20",
  },


  headerText: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    paddingRight: 34
  },
})