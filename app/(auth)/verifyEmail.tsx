import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'

import { useUser } from '@/contexts/UserAuth'
import { Link } from 'expo-router'

const VerifyEmail = () => {


  const [isUserVerified, setIsUserVerified] = useState(false)
  const params = useSearchParams();
  const userID = params.get("userID")
  const secret = params.get("secret")

  const authUser = useUser();
  const verifyEmail = async () => {
    try {
      if (userID && secret) {
        await authUser?.verifyEmail(userID, secret)
        setIsUserVerified(true)
      }
      else {
        throw new Error("Could not verify you. Please try again later")
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    verifyEmail()
  }, [])


  return (
    <View>
      {isUserVerified &&
        (
          <>
          <Text>Thank you for verifying your email. You can now login to your account.</Text>
          <Link href = "/"> Go to login </Link>
          </>
        )
      }

      {!isUserVerified &&
        (
          <Text>Sorry, we could not verify your email. Please try again</Text>
        )
      }


    </View>
  )
}

export default VerifyEmail

const styles = StyleSheet.create({})