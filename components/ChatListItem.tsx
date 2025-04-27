import { StyleSheet, Text, View, Pressable} from 'react-native'
import React from 'react'
import {Image} from 'expo-image'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { generateProfilePictureLink, userType } from '@/lib/appwriteFunctions'
import { blurhash } from '@/constants/blurhash'

type propType = {
  chatData: userType
}

const handleChatPress =  (receiverID: userType) => {
  router.push({ pathname: "/individualChat",
                params : {
                  user: JSON.stringify(receiverID)
                }})}

const ChatListItem = ({chatData} : propType) => {
  // console.log(chatData.profilePictureID)
  return (
    <Pressable style = {[styles.mainContainer]}
    onPress={() => handleChatPress(chatData)}
    >
      <Image 
      placeholder={{blurhash}}
      style= {styles.userImage}
      source = {generateProfilePictureLink(chatData.profilePictureID)}
      contentFit= "cover"
      />
      <View style = {styles.nameMessageContainer}>
        <Text style = {styles.text}>{`${chatData.firstName} ${chatData.lastName}`}</Text>
        <Text style = {styles.text}>{`${"Last Message"}`}</Text>
        
      </View>
    </Pressable>

  )
}

export default ChatListItem

const styles = StyleSheet.create({
  mainContainer: {
    display:"flex",
    flex:1,
    flexDirection: "row",
    gap:40,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxHeight: 70
  },
  userImage: {
    borderRadius: 50,
    height:50,
    width:50
  },
  nameMessageContainer:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 18,

  }
})