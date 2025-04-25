import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import { userType } from '@/lib/appwriteFunctions';
import {database, generateChatId, getAllMessagesByID, getLiveMessages, messageType} from "../../lib/firebase"
import { useUser } from '@/contexts/UserAuth';
import { collection, Firestore, onSnapshot, orderBy, query } from 'firebase/firestore';

const IndividualChat = () => {
  const userAuth = useUser()

  const { user } = useLocalSearchParams()
  const receiverUser: userType = user ? JSON.parse(user as string) : null;
  const [messages, setMessages] = useState<Array<messageType>>()
  
useEffect (
  () => {      
    console.log("useEffect calld")
    const chatID = generateChatId(userAuth?.current?.email!, receiverUser.email)
    const collectionRef = collection(database, "chatList", `${chatID}`, "messages")
    const q = query(collectionRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      let allMessagesToDisplay: messageType[] = []
      // console.log(snapshot.docs.length)
      snapshot.docs.map( doc => {
        let message:messageType = {
          messageText: doc.data().message,
          senderID: doc.data().senderId,
          date: doc.data().messageTime
        }
        allMessagesToDisplay.push(message)
      })
      setMessages(allMessagesToDisplay)
    })
    return () => {
      unsub()
    }
  }
  ,
   [receiverUser.email]
)
  return (
    <SafeAreaView style={styles.container}>
      <View style = {styles.messageView}>
      <FlatList 
      contentContainerStyle = { [
        styles.flatlistContainerStyle
      ]
      }
      style = {styles.flatList}
      data={messages}
      renderItem= {({ item }) => 
        <Text style = {[item.senderID == receiverUser.email ? styles.senderText : styles.receiverText]}
>{item.messageText}</Text>
      }
      />
      </View>

      <View style={styles.sendtextView}>
        <TextInput
          autoCorrect
          maxLength={100}
          multiline
          onChangeText={(val) => setMessage(val)}
          style={styles.textInput}
          placeholder='Enter a new message'
        />
        <Pressable style={styles.sendBotton}>
        <Feather name="send" size={24} color="lime" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default IndividualChat

const styles = StyleSheet.create({


  container: {
    flex: 1
  },

  messageView: {
    flex:1,
    marginBottom: 160
  },

  flatList: {
    flex:1
  },

  flatlistContainerStyle: {
      display: "flex",
      flex:1,
      flexDirection: "column",
      justifyContent: "flex-end"
  },

  senderText: {
    marginRight: "auto",
    marginLeft: "5%"
  },

  receiverText: {
    marginLeft: "auto",
    marginRight: "5%"
  },

  sendtextView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 20
  },

  textInput: {
    width: "90%",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: "5%",
    paddingVertical: 10,
    paddingHorizontal:10
  },

  sendBotton: {
    right: 0,
    backgroundColor: "blue",
    marginLeft: "auto",
    marginHorizontal: "5%",
    paddingHorizontal: 40,
    marginTop:10,
    paddingVertical: 10,
    borderRadius: 20
  }
})