import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
const logo = require("../../assets/icons/logo.png"); //require ensures the import correctly
import { Colors } from '@/constants/Colors';
import { Link } from "expo-router"
import CustomInput from '@/components/CustomInput';

import { useUser } from '@/contexts/UserAuth';

const Login = () => {
  const authContext = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    dob: ""
  })
  const [errorSpot, setErrorSpot] = useState(
    {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      dob: false,
      repeatPassword: false
    }
  )

  const [error, setError] = useState("")

  const setOtherErrorsToFalse = () => {
    setErrorSpot({
      ...errorSpot,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      dob: false,
      repeatPassword: false
    })
  }



  const handleFormSubmit = async () => {


    if (form.firstName.trim() == "") {
      setError("First name is required")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, firstName: true }))
      return
    }

    if (form.lastName.trim() == "") {
      setError("Last name is required")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, lastName: true }))
      return
    }

    if (form.email.trim() == "") {
      setError("Email field is required")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, email: true }))
      return
    }

    const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regx.test(form.email)
    if (!validEmail) {
      setError("Email is not in correct format")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, email: true }))
      return
    }

    if (form.password.trim() == "") {
      setError("Password field is required")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, password: true }))
      return
    }

    if (form.password.length < 8) {
      setError("Passwords should at least be 8 characters")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, password: true }))
      return
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match")
      setOtherErrorsToFalse()
      setErrorSpot((prev) => ({ ...prev, repeatPassword: true, password: true }))
      return
    }

    setOtherErrorsToFalse()

    setError("")

    // if all these conditions are met we can verify the input strings are OK

    try {
      setIsLoading(true)
      await authContext?.signup(form.email, form.password)
    }

    catch (error) {
      setError(`${error}`)
    }

    finally {
      setIsLoading(false)
    }


  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>\

          {isLoading ?
            <Text>Signing you up...</Text> :
            <View style={styles.mainContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.welcomeText}>Welcome to Wearloop</Text>

              <Text style={[styles.signInText, { color: Colors.light.cyan }]}> Sign In </Text>
              <View style={styles.namesInputContainer}>

                <CustomInput
                  title="First Name"
                  error={errorSpot.firstName}
                  value={form.firstName}
                  handleChangeText={(val) => setForm({ ...form, firstName: val })}
                  secureText={false}
                  keyboardType={'default'}
                  additionalStyles={{ flex: 1 }}
                />

                <CustomInput
                  title="Last Name"
                  error={errorSpot.lastName}
                  value={form.lastName}
                  handleChangeText={(val) => setForm({ ...form, lastName: val })}
                  secureText={false}
                  keyboardType={'default'}
                  additionalStyles={{ flex: 1 }}
                />
              </View>


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
                title='Password'
                error={errorSpot.password}
                value={form.password}
                handleChangeText={(val) => setForm({ ...form, password: val })}
                secureText={true}
                keyboardType={'default'}
                additionalStyles={null}
              />

              <CustomInput
                title='Repeat Password'
                error={errorSpot.repeatPassword}
                value={form.repeatPassword}
                handleChangeText={(val) => setForm({ ...form, repeatPassword: val })}
                secureText={true}
                keyboardType={'default'}
                additionalStyles={null}
              />

              {error &&
                <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
              }
              <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: Colors.light.lime }]}
                onPress={handleFormSubmit}
              >
                <Text style={styles.signInButtonText}>Sign Up</Text>
              </TouchableOpacity>
              <Text style={styles.orText}>OR</Text>
              <Text style={styles.noAccountText}>Already have an account ? {` `}
                <Link href="/" style={[styles.signUpText, { color: Colors.light.cyan }]}>Sign In Instead</Link>
              </Text>
            </View>
          }




        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Login

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: "10%",
    marginHorizontal: "5%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
    flex: 1
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
    marginTop: 5
  },

  signInText: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: 24
  },

  namesInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10
  },

  forgotPassword: {
    alignSelf: "flex-end",
    paddingHorizontal: 10

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