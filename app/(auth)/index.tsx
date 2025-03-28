import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
const logo = require("../../assets/icons/logo.png"); //require ensures the import correctly
import { Colors } from '@/constants/Colors';
import { Link, router } from "expo-router"

import CustomInput from "../../components/CustomInput"
import { useUser } from '@/contexts/UserAuth';

const Login = () => {
  const authContext = useUser();
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("");
  const [errorSpot, setErrorSpot] = useState({
    email: false,
    password: false
  })
  const handleFormSubmit = async () => {
    if (form.email.trim() == "") {
      setError("Email field is required")
      setErrorSpot({ password: false, email: true })
      return
    }

    const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regx.test(form.email)
    if (!validEmail) {
      setError("Email is not in correct format")
      setErrorSpot({ password: false, email: true })
      return
    }

    if (form.password.trim() == "") {
      setError("Password field is required")
      setErrorSpot({ email: false, password: true })
      return
    }

    if (form.password.length < 6) {
      setError("Password must at least be 6 characters")
      setErrorSpot({ email: false, password: true })
      return
    }

    // if all these conditions are met we can verify the input strings are OK
    setError("")
    setErrorSpot({ email: false, password: false })

    try {
      setIsLoading(true)
      await authContext?.login(form.email, form.password)
      console.log(authContext?.current?.email)
    }

    catch (error) {
      setError(`${error}`)
    }
    finally {
      setIsLoading(false)
    }

  }


  useEffect(() => {
    if ( authContext?.current) {
      console.log("User logged in already. Redirecting them to the home page")
      { router.replace("/home") }
    }
  }, [authContext?.current])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ }}>
        {
          isLoading ? <Text style={styles.mainContainer}>
            Signing you in. Won't be a moment.....
          </Text>
            :
            <View style={styles.mainContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.welcomeText}>Welcome back to Wearloop</Text>
              <Text style={styles.bannerText}>Where clothes dream second life, and you become the reason</Text>
              <Text style={[styles.signInText, { color: Colors.light.cyan }]}> Sign In </Text>
              <CustomInput
                title="Email"
                error={errorSpot.email}
                value={form.email}
                handleChangeText={(val) => setForm({ ...form, email: val })}
                secureText={false}
                keyboardType={'email-address'}
                additionalStyles={null}
              />

              <CustomInput
                title="Password"
                error={errorSpot.password}
                value={form.password}
                handleChangeText={(val) => setForm({ ...form, password: val })}
                secureText={true}
                keyboardType={'default'}
                additionalStyles={null}
              />

              {error &&
                <Text style={{ color: "red" }}>{error}</Text>
              }

              {/* This needs to be changed so that it takes us to forgot password page */}
              <Link style={[styles.forgotPassword, { color: Colors.light.cyan }]} href="/forgotPassword">
                Forgot Password ?
              </Link>

              <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: Colors.light.lime }]}
                onPress={handleFormSubmit}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
              <Text style={styles.orText}>OR</Text>
              <Text style={styles.noAccountText}>Don't have an account ? {` `}
                <Link href="/signup" style={[styles.signUpText, { color: Colors.light.cyan }]}>Sign Up Instead</Link>
              </Text>
            </View>

        }

      </ScrollView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginBottom: "10%",
    marginHorizontal: "5%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10
  },

  logo: {
    height: 120,
    resizeMode: "contain",
    alignSelf: "center"
  },

  welcomeText: {
    marginTop: 44,
    fontSize: 28,
    fontWeight: 600,
    alignSelf: "center"
  },

  bannerText: {
    marginTop: 5,
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "600",
    alignSelf: "center"
  },

  signInText: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: 44
  },

  forgotPassword: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    marginTop: 10

  },

  signInButton: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 10,
    borderColor: "none",
    borderRadius: 10
  },

  signInButtonText: {
    fontSize: 20,
    alignSelf: "center"
  },

  orText: {
    alignSelf: "center",
    fontSize: 18,
    marginTop: 18
  },

  noAccountText: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10
  },

  signUpText: {
    fontSize: 20,
    fontWeight: "bold"
  }

})