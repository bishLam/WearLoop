import { StyleSheet, Text, View } from 'react-native'
import react, { useState, useEffect, useContext, createContext }  from 'react'

import { account, database, addUserToCollection } from "../lib/appwrite"
import { ID, Models } from 'react-native-appwrite'
import { router } from 'expo-router'
import Toast from '@/components/toast'
import React from 'react'




//this is the type for default context of the app

interface userContextType {
  current: userType,
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>
  signup: (email: string, password: string, firstName:string, lastName:string) => Promise<void>
  checkUserEmail: (email: string) => Promise<void>
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


  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    await account.create(ID.unique(), email, password, firstName)
    //we need to create a session initially to send the verification link to that user
    await account.createEmailPasswordSession(email, password)
    await account.createVerification("https://verifywearloop.netlify.app/")
    // await account.updatePrefs({firstName, lastName}) //this is something we can store when we are signed up and could be used anywhere to get tjat info with just calling .prefs method
    await account.deleteSession("current")
    await addUserToCollection(firstName, lastName, email)
    Toast("A verification link has been sent to your email. Verify email to log in to your account")
    await login(email, password, firstName, lastName)
    router.replace("/")
  }

  const login = async (email: string, password: string, firstName?: string, lastName?: string) => {
    // await logout(); //remove this later
    await account.createEmailPasswordSession(email, password)
    const loggedInUser = await account.get();
    if (loggedInUser.emailVerification) {
      //creating a user document with their names
      setUser(loggedInUser)
      router.replace("/home")
    }
    else {
      await account.deleteSession("current")
      console.log("User email is not verified")
      throw new Error("Verify email to continue")
    }
  }

  const logout = async () => {
    await account.deleteSession("current")
    console.log(`${user?.email} logged out`)
    router.replace("/")
    router.dismissAll()

    setUser(null)

  }

  //this will be used to check if the user already exists in the database
  const checkUserEmail = async (email: string) => {
    // const user = account.s
    // const userEmail 
    console.log("User does not exist")
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
    <UserContext.Provider value={{ current: user, login, logout, signup, checkUserEmail }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
