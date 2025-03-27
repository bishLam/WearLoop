import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, Router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from "expo-image-picker"
import Toast from '@/components/toast';

import { defaultImage } from '@/constants/defaultImage';


const Create = () => {
  const [form, setForm] = useState({
    gender: "",
    image: "",
    category: "",
    condition: "",
    description: ""
  })

  const conditions = [
    { label: "New", value: "New" },
    { label: "Barely Worn", value: "Barely Worn" },
    { label: "Used", value: "Used" }
  ]

  const category = [
    { label: "Tops", value: "Tops" },
    { label: "Hats", value: "Hats" },
    { label: "Pants", value: "Pants" },
    { label: "Shirts", value: "Shirts" },
    { label: "Shoes", value: "Shoes" },
    { label: "Bags", value: "Bags" }
  ]


  const handleImagePickerPress = async () => {
    const permissionAccess = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionAccess.granted) {
      Toast("Sorry we need image permission to get this done")
      await ImagePicker.requestMediaLibraryPermissionsAsync()
      return
    }

    //open image picker
    const result = await ImagePicker.launchImageLibraryAsync(
      {
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1
      }
    )
    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri })
    }

  }

  const handleGenderChange = (gender: string) => {
    if (gender === "male") {
      setForm({ ...form, gender: "male" })
    }
    else if (gender === "female") {
      setForm({ ...form, gender: "female" })
    }
    else if (gender === "other") {
      setForm({ ...form, gender: "other" })
    }
  }

  const handleFormSubmit = () => {

  }


  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style = {{flex:1}}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%" }}>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              {/* button to go back to the previous page */}
              <TouchableOpacity style={styles.backButton}
                onPress={() => router.replace("/home")}
              >
                {/* <Text style={styles.backButtonText}> {`<`} </Text> */}
                <AntDesign name="arrowleft" size={34} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Upload a cloth</Text>
            </View>
            {/* View with image and buttons to change the image */}
            <View>
              <Image
                style={styles.image}
                source={
                  form.image ? {
                    uri: form.image
                  } :
                    { uri: defaultImage }}
              />

              <TouchableOpacity style={[{ backgroundColor: Colors.light.gray }, styles.editImageButton]}
                onPress={
                  handleImagePickerPress
                }
              >
                <Text style={{ color: "white", fontWeight: 600, flex: 1, textAlign: "center" }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {/* View to set the cloth details */}
            <View style={styles.genderContainer}>
              {/* horizontal view to set the gender */}
              <Text style={styles.titleText}>Select a gender*</Text>
              <View style={styles.genderButtons}>
                <Pressable style={[form.gender === "male" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => handleGenderChange("male")}
                >
                  <Text style={{ textAlign: "center" }}>Male</Text>
                </Pressable>
                <Pressable style={[form.gender === "female" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => handleGenderChange("female")}
                >
                  <Text style={{ textAlign: "center" }}>Female</Text>
                </Pressable>
                <Pressable style={[form.gender === "other" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => handleGenderChange("other")}
                >
                  <Text style={{ textAlign: "center" }}>Other</Text>
                </Pressable>
              </View>
            </View>


            {/* View to select Category */}
            <View >
              <Text style={styles.titleText}>Select Category*</Text>
              <Dropdown
                style={[{ borderBlockColor: Colors.light.gray }, styles.dropdownContainer]}
                mode='default'
                data={category}
                onChange={(e) => { }}
                labelField={'label'}
                valueField={'value'}
                activeColor={Colors.light.cyan}
              />
            </View>

            {/* View to select conditions */}
            <View >
              <Text style={styles.titleText}>Select Condition*</Text>
              <Dropdown
                style={[{ borderBlockColor: Colors.light.gray }, styles.dropdownContainer]}
                mode='default'
                data={conditions}
                onChange={(e) => { }}
                labelField={'label'}
                valueField={'value'}
                activeColor={Colors.light.cyan}
              />
            </View>
                {/* Description container */}
            <View >
              <Text style={styles.titleText}>Description*</Text>
              <TextInput
                multiline
                numberOfLines={6}
                placeholder="Enter description for your cloth"
                style={styles.descriptionInput}
                scrollEnabled
                submitBehavior="newline"
              />
            </View>

            {/* submit button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors.light.lime }]}
              onPress={handleFormSubmit}
            >
            <Text style={styles.submitButtonText}>Upload</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default Create

const styles = StyleSheet.create({

  mainContainer: {
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-end",
    gap:20
  },
  backButton: {
    // backgroundColor:"red"

  },
  backButtonText: {
    fontSize: 40
  },

  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    fontSize: 25,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    paddingRight: 34
  },

  image: {
    height: 150,
    width: 150,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 15
  },

  editImageButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 5,
    width: 80,
    alignSelf: "center"
  },

  genderContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    gap: 10
  },
  titleText: {
    fontWeight: 600,
    fontSize: 16,
    marginTop: 10
  },
  genderButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10
  },
  gender: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
  },

  activeGender: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5
  },
  descriptionInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40
  },
  submitButton: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 10,
    borderColor: "none",
    borderRadius: 10
  },

  submitButtonText: {
    fontSize: 20,
    alignSelf: "center"
  },
})