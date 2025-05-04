import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
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
import { Colors } from '@/constants/Colors';
import { blurhash } from '@/constants/blurhash';

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
    let myuuid = uuid.v4()
    const chatRef = doc(database, "chatList", `${chatID}`, "messages", `${myuuid}`)
    await setDoc(chatRef, {
      message: typedMessage,
      messageTime: Timestamp.now(),
      senderID: userAuth?.current?.email
    })
    setTypedMessage("")
  }

  const sendInitialMessage = () => {
    setTypedMessage("Hello!")
    sendMessageToDatabase()
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.headerLeftView}>
            <TouchableOpacity
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
          {
            messages ?
              messages!.length > 0 ?
                <FlatList
                  contentContainerStyle={[
                    styles.flatlistContainerStyle
                  ]
                  }
                  style={styles.flatList}
                  data={messages}
                  scrollEnabled
                  scrollsToTop={false}
                  renderItem={({ item }) =>
                    item.senderID === receiverUser.email ?
                      <View style={styles.senderTextContainer}>
                        <Image
                          source={generateProfilePictureLink(receiverUser.profilePictureID)}
                          style={styles.senderImage}
                          placeholder={blurhash}
                        />
                        <Text style={styles.senderText} >
                          {item.messageText}
                        </Text>
                      </View>
                      :
                      <Text style={styles.receiverText} >
                        {item.messageText}
                      </Text>
                    // <Text style={[item.senderID === receiverUser.email ? styles.senderText : styles.receiverText]}>
                    //   {item.messageText}
                    // </Text>
                  }
                />

                :

                <TouchableOpacity style={[styles.noMessagesButton, { backgroundColor: Colors.light.cyan }]}
                  onPress={
                    sendInitialMessage
                  }
                >
                  <Text style={[styles.noMessagesButtonText]}>Click to say hello</Text>
                </TouchableOpacity>

              :
              <>
              </>
          }

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
          <TouchableOpacity style={styles.sendBotton} onPress={sendMessageToDatabase}>
            <Feather name="send" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    width: "100%",
    zIndex: 1
  },

  headerLeftView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20
  },
  headerRightView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20
  },
  userImage: {
    borderRadius: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    height: 40,
    width: 40
  },

  messageView: {
    flex: 1,
    marginBottom: 70,
    backgroundColor: "#f5f5f5"
  },

  flatList: {
    flex: 1,
    zIndex: 0,
    paddingVertical: "3%",
    paddingHorizontal: "2%",
  },

  flatlistContainerStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 20,
    paddingBottom: 30
  },

  senderTextContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: 10
  },

  senderImage: {
    height: 30,
    width: 30,
    borderRadius: 50,

  },

  senderText: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxWidth: "80%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    color: "black",
    fontSize: 16,
  },

  receiverText: {
    marginLeft: "auto",
    backgroundColor: "blue",
    color: "white",
    fontSize: 16,
    maxWidth: "80%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20
  },

  sendtextView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginTop: 0,
    marginBottom: 20

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
    paddingEnd: 60
  },

  sendBotton: {
    right: 0,
    marginLeft: "auto",
    position: "absolute",
    marginHorizontal: "5.3%",
    paddingHorizontal: 20,
    paddingVertical: 2,
    marginTop: 2,
    backgroundColor: "blue",
    borderRadius: 10
  },

  noMessagesButton: {
    bottom: 0,
    backgroundColor: "lime",
    marginTop: "auto",
    marginBottom: 50,
    paddingHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 20,
    width: 200,
    alignSelf: "center"

  },

  noMessagesButtonText: {
    textAlign: "center",
    fontSize: 20

  }
})