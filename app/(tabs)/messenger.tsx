import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { router } from 'expo-router'
import { listAllUsers, generateProfilePictureLink, userType } from '@/lib/appwriteFunctions'
import ChatListItem from '@/components/ChatListItem'
import { database, generateChatId, messageType } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { useUser } from '@/contexts/UserAuth'
import LoadingScreen from '../loadingScreen'


const getUserEmailFromChatID = (chatID: string, currentUserEmail: string) => {
  var userEmail = ""
  const splittedUser = chatID.split("_")
  console.log(splittedUser[0] + " " + splittedUser[1])
  if (splittedUser.length > 0) {
    splittedUser.forEach(singleUserEmail => {
      if (singleUserEmail !== currentUserEmail) {
        userEmail = singleUserEmail
      }
    });
    return userEmail
  }
}



const Messeges = () => {
  const userAuth = useUser();

  //states variables
  const [isLoading, setIsLoading] = useState(true)

  const [usersFromAppwrite, setusersFromAppwrite] = useState<Array<userType>>([{
    email: '',
    firstName: '',
    lastName: '',
    profilePictureID: '',
    userID: ''
  }
  ])

  useEffect(() => {
    setIsLoading(true)
    const allUsers = async () => {
      try {
        let users = await listAllUsers()
        if (users?.length == 0) {
          return
        }
        setusersFromAppwrite(() => users!)
      }
      catch (error) {
        console.log(`${error} error is this`)
      }
      finally {
        setIsLoading(false)
      }

    }
    allUsers()
  }, [])

  useEffect(
    () => {

      usersFromAppwrite.forEach(userFromAppwrite => {

        // console.log("looking for this user " + userFromAppwrite.email)
        const chatID = generateChatId(userAuth?.current?.email!, userFromAppwrite.email)
        const collectionRef = collection(database, "chatList", `${chatID}`, "messages")
        // const q = query(collectionRef, orderBy("messageTime", "asc"));c

        const checkUserExists = async () => {
          //first generate the userchatid coming from appwrite
          const docRefInFirebase = doc(database, "chatList", `${chatID}`) //document ref to the chatID in firestore
          const docSnap = await getDoc(docRefInFirebase);

          if (docSnap.exists()) {
            //the user exists, now getting the value from the appwrite
            let userEmail = getUserEmailFromChatID(chatID, userAuth?.current?.email!)
          }
        }
        checkUserExists()



        // const unsub = onSnapshot(q, (snapshot) => {
        //   let allMessagesToDisplay: messageType[] = []
        //   snapshot.docs.map(doc => {
        //     let message: messageType = {
        //       messageText: doc.data().message,
        //       senderID: doc.data().senderID,
        //       date: doc.data().messageTime
        //     }
        //     allMessagesToDisplay.push(message)
        //   })
        //   setMessages(allMessagesToDisplay)
        // })
        // return () => {
        //   unsub()
        // }
      })
    }
    ,
    [usersFromAppwrite, userAuth?.current?.email]
  )

  const flatListHeader = () => {
    return <View style={styles.headerContainer}>
      <View style={styles.leftHeaderContainer}>
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

      {
        isLoading ?
          <LoadingScreen />
          :
          <FlatList
            style={styles.flatList}
            data={usersFromAppwrite}
            renderItem={({ item }) =>
              <ChatListItem
                chatData={item}
              />
            }
            ListHeaderComponent={flatListHeader}
          />
      }

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
    marginBottom: 20
    // paddingHorizontal: "5%"
  },

  leftHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20
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

  flatList: {
    paddingHorizontal: "5%"
  }
})