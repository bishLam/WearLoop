import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,  {useEffect, useState} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { router } from 'expo-router'
import { listAllUsers, generateProfilePictureLink, userType } from '@/lib/appwriteFunctions'
import ChatListItem from '@/components/ChatListItem'





const Messeges = () => {

  const [chatListData, setChatListData] = useState<Array<userType>>([{
    email: '',
    firstName: '',
    lastName: '',
    profilePictureID: '',
    userID: ''
  }
])

useEffect(() => {
  const allUsers = async() => {
    let users = await listAllUsers()
    if (users?.length == 0) {
      return
    }
    setChatListData(() => users!)
  }
allUsers()
}, [])

const flatListHeader = () => {
  return        <View style={styles.headerContainer}>
  <View style={styles.leftHeaderContainer}>
    <TouchableOpacity style={styles.backButton}
      onPress={() => router.back()}
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
}


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList 
      data={chatListData}
      renderItem= {({ item }) => 
        <ChatListItem 
        chatData = {item}
        />
      }
      ListHeaderComponent={flatListHeader}
      />
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