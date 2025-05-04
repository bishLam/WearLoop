import { StyleSheet, Text, View, Pressable} from 'react-native'
import React from 'react'
import {Image} from 'expo-image'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { generateProfilePictureLink, userType } from '@/lib/appwriteFunctions'
import { blurhash } from '@/constants/blurhash'
import { userMessageType } from '@/app/(tabs)/messenger'
import { useUser } from '@/contexts/UserAuth'

type propType = {
  chatData: userMessageType
}

const handleChatPress =  (receiverID: userType) => {
  router.push({ pathname: "/individualChat",
                params : {
                  user: JSON.stringify(receiverID)
                }})}

const ChatListItem = ({chatData} : propType) => {
  // console.log(chatData.lastMessage)
  const userAuth = useUser()
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
        {
          chatData.lastMessageUser === userAuth?.current?.email ?
          <Text style = {styles.yourText} numberOfLines={1}>{`You: ${chatData.lastMessage}`}</Text>
          :
          <Text style = {styles.text} numberOfLines={1}>{`Them: ${chatData.lastMessage}`}</Text>
        }
        
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
    gap:20,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: "3%",
    paddingVertical: 10,
    maxHeight: 70
  },
  userImage: {
    borderRadius: "50%",
    height:50,
    width:50,
  },
  nameMessageContainer:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex:1,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  yourText: {
    fontSize: 18,
    fontWeight: "400",
  }
})