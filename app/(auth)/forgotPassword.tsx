import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import CustomInput from '@/components/CustomInput';
import { Colors } from '@/constants/Colors';
import Toast from '@/components/toast';
import { useUser } from '@/contexts/UserAuth';


const ForgotPassword = () => {
  const userAuth = useUser();


  //assets should be imported via require function
  const logo = require("../../assets/icons/logo.png");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = async() => {
    if(!email || email === ""){
      setError("Please enter a valid email")
      return
    }

    // if(userAuth?)
    

    Toast("An email has been sent to yourr account with information about forgetting your password. Please visit the link to change the password")
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.welcomeText}>Hello Wearlooper</Text>
          <Text style={[styles.forgotPwdText, { color: Colors.light.cyan }]}> Please enter your email and click the forgot button. </Text>
          <CustomInput
            title="Email"
            error={error == ""? false : true}
            value={email}
            handleChangeText={(val: string) => setEmail(val)}
            secureText={false}
            keyboardType={'email-address'}
            additionalStyles={null}
          />


          {error &&
            <Text style={{ color: "red" }}>{error}</Text>
          }

          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: Colors.light.lime }]}
            onPress={handleFormSubmit}
          >
            <Text style={styles.sendEmailText}>Send Email Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPassword

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

  forgotPwdText: {

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

  sendEmailText: {
    fontSize: 20,
    alignSelf: "center"
  }
})