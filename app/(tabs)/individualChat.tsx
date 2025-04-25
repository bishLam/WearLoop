import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import { generateProfilePictureLink, userType } from '@/lib/appwriteFunctions';
import { database, generateChatId, getAllMessagesByID, getLiveMessages, messageType } from "../../lib/firebase"
import { useUser } from '@/contexts/UserAuth';
import { collection, Firestore, onSnapshot, orderBy, query, setDoc, doc, Timestamp } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import { TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const IndividualChat = () => {
  const userAuth = useUser()
  const { user } = useLocalSearchParams()
  const receiverUser: userType = user ? JSON.parse(user as string) : null; //receiver of the message clicked from the chatlist
  const [typedMessage, setTypedMessage] = useState("")
  const [messages, setMessages] = useState<Array<messageType>>()

  useEffect(
    () => {
      const chatID = generateChatId(userAuth?.current?.email!, receiverUser.email)
      const collectionRef = collection(database, "chatList", `${chatID}`, "messages")
      const q = query(collectionRef, orderBy("messageTime", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        let allMessagesToDisplay: messageType[] = []
        snapshot.docs.map(doc => {
          let message: messageType = {
            messageText: doc.data().message,
            senderID: doc.data().senderID,
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
    [receiverUser.email, userAuth?.current?.email]
  )

  const sendMessageToDatabase = async () => {
    if (typedMessage.trim() === "") return

    const chatID = generateChatId(userAuth?.current?.email!, receiverUser.email)
    // console.log(chatID + " mesage id")
    let myuuid = uuid.v4()
    const chatRef = doc(database, "chatList", `${chatID}`, "messages", `${myuuid}`)
    await setDoc(chatRef, {
      message: typedMessage,
      messageTime: Timestamp.now(),
      senderID: userAuth?.current?.email
    })
    setTypedMessage("")


  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.headerLeftView}>
          <TouchableOpacity style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={34} color="black" />
          </TouchableOpacity>
          <Image
            style={styles.userImage}
            source={generateProfilePictureLink(receiverUser.profilePictureID)}
            contentFit="cover"
          />
          <View>
            <Text>{`${receiverUser.firstName} ${receiverUser.lastName}`}</Text>
            <Text>{`Active Now`}</Text>
          </View>
        </View>
        <View style={styles.headerRightView}>

        <MaterialIcons name="call" size={24} color="black" />
        <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>

      </View>
      <View style={styles.messageView}>
        <FlatList
          contentContainerStyle={[
            styles.flatlistContainerStyle
          ]
          }
          style={styles.flatList}
          data={messages}
          scrollEnabled
          renderItem={({ item }) =>
            <Text style={[item.senderID === receiverUser.email ? styles.senderText : styles.receiverText]}>
              {item.messageText}
            </Text>
          }
        />
      </View>
      <View style={styles.sendtextView}>
        <TextInput
          autoCorrect
          multiline
          value={typedMessage}
          onChangeText={(val) => setTypedMessage(val)}
          style={styles.textInput}
          placeholder='Enter a new message'
        />
        <Pressable style={styles.sendBotton} onPress={sendMessageToDatabase}>
          <Feather name="send" size={35} color="blue" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default IndividualChat

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },

  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    backgroundColor: "white",
    width:"100%",
    zIndex:1
  },

  headerLeftView: {
    display:"flex",
    flexDirection:"row",
    alignItems: "center",
    gap: 20
  },
  headerRightView :{
    flexDirection: "row",
    justifyContent: "flex-end",
    gap:20
  },
  userImage: {
    borderRadius: 50,
    borderColor: "gray",
    borderWidth:0.5,
    height: 40,
    width: 40
  },

  messageView: {
    flex: 1,
    marginBottom: 160,
    backgroundColor: "#f5f5f5"
  },

  flatList: {
    flex: 1,
    zIndex:0
  },

  flatlistContainerStyle: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 20,
  },

  senderText: {
    marginRight: "auto",
    marginLeft: "5%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    borderBottomRightRadius:20,
    color:"black",
    fontSize:16,
  },

  receiverText: {
    marginLeft: "auto",
    marginRight: "5%",
    backgroundColor: "blue",
    color:"white",
    fontSize:16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,
    borderTopLeftRadius:20
  },

  sendtextView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 20,
    
  },

  textInput: {
    width: "90%",
    borderRadius: 10,
    borderColor: "gray",
    position: "relative",
    borderWidth: 1,
    marginHorizontal: "5%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingEnd:100
  },

  sendBotton: {
    right: 0,
    marginLeft: "auto",
    position: "absolute",
    marginHorizontal: "6%",
    paddingVertical: 5,
    borderRadius: 20,
  }
})