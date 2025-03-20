import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect, useContext, createContext } from 'react'

import { account, database } from "../lib/appwrite"
import { ID, Models } from 'react-native-appwrite'
import { router } from 'expo-router'
import Toast from '@/components/toast'




//this is the type for default context of the app

interface userContextType {
  current: userType,
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  verifyEmail: (userID:string, password:string) => Promise<void>
}

type childrenType = {
  children: React.ReactNode | null
}

type userType = Models.User<Models.Preferences> | null

const UserContext = createContext<userContextType | null>(null);

export const useUser = () => {
  return useContext(UserContext)
}

const UserProvider = ({ children }: childrenType) => {
  const [user, setUser] = useState<userType | null>(null)


  const signup = async (email: string, password: string) => {
    await account.create(ID.unique(), email, password)
    //we need to create a session initially to send the verification link to that user
    await account.createEmailPasswordSession(email, password)

    //change the below line once you have the app deployed in the app store
    await account.createVerification("https://verifywearloop.netlify.app/") 
    await account.deleteSession("current")
    Toast("A verification link has been sent to your email. Verify first to log in to your account")
    router.replace("/")
    await login(email, password)
  }

  const login = async (email: string, password: string) => {
    // await logout();
    await account.createEmailPasswordSession(email, password)
    const loggedInUser = await account.get();
    if (loggedInUser.emailVerification) {
      const loggedInUser = await account.get();
      setUser(loggedInUser)
      router.replace("/home")
    }
    else{
      await account.deleteSession("current")
      console.log("Session terminated")
      throw new Error("Verify email to continue")
    }
  }

  const logout = async () => {
    console.log(`${user?.email}`)
    await account.deleteSession("current")
    console.log("User logged out")
    setUser(null)
    router.replace("/")
  }

  const verifyEmail = async (userID:string, secret:string) => {
    await account.updateVerification(userID, secret)
    console.log("User verified successfully")
  }

  const init = async () => {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser)
    }
    catch (error) {
      setUser(null)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <UserContext.Provider value={{ current: user, login, logout, signup, verifyEmail }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
