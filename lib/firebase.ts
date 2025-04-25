// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { collection, getDocs, getFirestore, Timestamp, onSnapshot, orderBy, query } from "firebase/firestore"
import { Query } from "react-native-appwrite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaPExNzOxKU-nrd-WaxMyHcVbagURPm1c",
  authDomain: "wearloop-28326.firebaseapp.com",
  databaseURL: "https://wearloop-28326-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wearloop-28326",
  storageBucket: "wearloop-28326.firebasestorage.app",
  messagingSenderId: "474236842486",
  appId: "1:474236842486:web:928851ca012cf0cfc957d7",
  measurementId: "G-WNWND08N3Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)

export const generateChatId = (user1: string, user2: string) => {
  var result = [user1, user2].sort().join("_")
  console.log(result)
  return result
}

export type messageType = {
  messageText: string,
  senderID: string,
  date: Timestamp
}

export const getAllMessagesByID = async (user1: string, user2: string) => {
  const messages: messageType[] = []
  const chatID = generateChatId(user1, user2)
  const querySnapshot = await getDocs(collection(database, "chatList", `${chatID}`, "messages"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let message: messageType = {
      messageText: data["message"] as string,
      senderID: data["senderID"] as string,
      date: data["messageTime"] as Timestamp
    }
    messages.push(message)
  });
  return messages
}

export const getLiveMessages = async (user1: string, user2: string, callback: (messages: messageType[]) => void) => {
  let allMessages: messageType[] = []
  const chatID = generateChatId(user1, user2)
  const collectionRef = collection(database, "chatList", `${chatID}`, "messages")
  const q = query(collectionRef, orderBy("createdAt", "asc"));

  let unsub = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let individualMessage = doc.data();
      allMessages.push({
        messageText: individualMessage.messageText,
        senderID: individualMessage.senderID,
        date: individualMessage.messageTime
      })
    })
    callback(allMessages)
  })
  return unsub

}

