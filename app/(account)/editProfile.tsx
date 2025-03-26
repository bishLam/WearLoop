import { SafeAreaView, ScrollView, Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomInput from '@/components/CustomInput'
import { router } from "expo-router"

import { Colors } from "../../constants/Colors"


const dummy = require("../../assets/images/dummy-profile.png")

const EditProfile = () => {



  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: ""
  })
  const [errorSpot, setErrorSpot] = useState(
    {
      firstName: false,
      lastName: false,
      email: false,
      dob: false,
    }
  )
  const [error, setError] = useState("")

  const setOtherErrorsToFalse = () => {
    setErrorSpot({
      ...errorSpot,
      firstName: false,
      lastName: false,
      email: false,
      dob: false,
    })
  }

  const [saveButtonActive, setSaveButtonActive] = useState(false)

  const textChanged = () => {
    var initialValues = {
      email: "",
      firstName: "",
      lastName: ""
    }

    if (form.firstName != initialValues.firstName) {
      setSaveButtonActive(true)
      return
    }

    if (form.lastName != initialValues.lastName) {
      setSaveButtonActive(true)
      return
    }

    if (form.email != initialValues.email) {
      setSaveButtonActive(true)
      return
    }

    setSaveButtonActive(false)
  }

  const handleFormSubmit = async () => {
    if (form.firstName.trim() == "") {
      setError("Email field is required")
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

    setOtherErrorsToFalse()
    setError("")

  }

  const handleSavePressed = () =>{
    router.replace("/(account)/profile")
  }
  useEffect(() => {
    textChanged();
  }, [form.firstName, form.lastName, form.email])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical:"1%" }}>
        <Pressable onPress={handleSavePressed} style={[!saveButtonActive && styles.saveButtonDefault, saveButtonActive && styles.saveButtonActive]}>
          <Text style={[!saveButtonActive && styles.saveTextDefault, saveButtonActive && styles.saveTextActive]}>Save</Text>
        </Pressable>
        <View style={styles.mainContainer}>
          <Image style={styles.image} source={dummy} />
          <TouchableOpacity style={[{ backgroundColor: Colors.light.gray }, styles.editButton]} >
            <Text style={{ color: "white", fontWeight: 600 }}>
              Edit
            </Text>
          </TouchableOpacity>
          <View style={styles.namesInputContainer}>
            <CustomInput
              title='First Name'
              error={errorSpot.firstName}
              handleChangeText={(val) => { (setForm({ ...form, firstName: val })) }}
              keyboardType='default'
              value={form.firstName}
              secureText={false}
              additionalStyles={{ flex: 1 }}

            />
            <CustomInput
              title='Last Name'
              error={false}
              handleChangeText={(val) => { setForm({ ...form, lastName: val }) }}
              keyboardType='default'
              value={form.lastName}
              secureText={false}
              additionalStyles={{ flex: 1 }}
            />
          </View>
          <CustomInput
            title='Email'
            error={false}
            handleChangeText={(val) => { setForm({ ...form, email: val }) }}
            keyboardType='email-address'
            value={form.email}
            secureText={false}
            additionalStyles={{ width: "100%" }}
          />


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({

  saveButtonDefault: {
    backgroundColor: "gray",
    alignSelf: "flex-end",
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 15
  },

  saveButtonActive: {
    backgroundColor: "red",
    alignSelf: "flex-end",
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 15
  },

  saveTextDefault: {
    color: "black"
  },

  saveTextActive: {
    color: "white"
  },

  mainContainer: {
    flex: 1,
    alignItems: "center"
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 20
  },
  editButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 5,
  },

  namesInputContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10
  },

})