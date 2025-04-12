import { SafeAreaView, ScrollView, Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomInput from '@/components/CustomInput'
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"

import { Colors } from "../../constants/Colors"
import AntDesign from '@expo/vector-icons/AntDesign'
import { defaultImage } from '@/constants/defaultImage'
import Toast from '@/components/toast'
import { useUser } from '@/contexts/UserAuth'
import { addUserImageToBucket, deleteModifiedImageFromBucket, fileType, generateProfilePictureLink, updateUserDetails, userType } from '@/lib/appwriteFunctions'
import { getUserDetailsFromEmail } from '@/lib/appwriteFunctions'
import LoadingScreen from '../loadingScreen'
import { ID } from 'react-native-appwrite'

const EditProfile = () => {
  const [isLoading, setisLoading] = useState(true)
  const [] = useState()
  const userContext = useUser();
  const [userDetails, setUserDetails] = useState<userType>()
  const [form, setForm] = useState<userType>({
    firstName: "",
    lastName: "",
    email: "",
    profilePictureID: defaultImage,
    userID: ""
  })
  const [initialValues, setInitialValues] = useState<userType>({
    email: "",
    firstName: "",
    lastName: "",
    profilePictureID: defaultImage,
    userID:""
  })
  const [image, setImage] = useState<fileType>({
    name: "",
    type: "",
    size: 0,
    uri: ""
  })

  const setOtherErrorsToFalse = () => {
    setErrorSpot({
      ...errorSpot,
      firstName: false,
      lastName: false,
      email: false,
      dob: false,
    })
  }
  const [errorSpot, setErrorSpot] = useState(
    {
      firstName: false,
      lastName: false,
      email: false,
      dob: false,
    }
  )
  const [error, setError] = useState("")



  const [saveButtonActive, setSaveButtonActive] = useState(false)

  const textChanged = () => {

    if (form.firstName != initialValues!.firstName) {
      setSaveButtonActive(true)
      return
    }

    if (form.lastName != initialValues!.lastName) {
      setSaveButtonActive(true)
      return
    }

    if (form.email != initialValues!.email) {
      setSaveButtonActive(true)
      return
    }

    if (form.profilePictureID != initialValues!.profilePictureID) {
      setSaveButtonActive(true)
      return
    }

    setSaveButtonActive(false)
  }

  const handleSavePressed = async () => {
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


    //here we do the update part. 
    try {
      //upload new image to the bucket if there is any
      if(image.name !== "" && image){
        const id = ID.unique()
        await addUserImageToBucket(image, id)
        await updateUserDetails(userDetails?.userID ?? "", id, form.firstName, form.lastName)
        await deleteModifiedImageFromBucket(userDetails?.profilePictureID ?? "")
        router.back()
        return
      }

      if(image.name == ""){
        await updateUserDetails(userDetails?.userID ?? "", userDetails?.profilePictureID ?? "", form.firstName, form.lastName)
        router.back()
      }
    }
    catch (error) {
      Toast(error + "")
    }

  }

  const handleEditAvatarPress = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast("We need camera permission to set your profile picture. Please give us the permission by going into your settings and try again.")
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1,1]

    });

    if (!result.canceled) {
      const assetReceived = result.assets[0]
      setForm({
        ...form,
        profilePictureID: assetReceived.uri
      })

      setImage({
        name: assetReceived.fileName ?? "",
        type: assetReceived.mimeType ?? "",
        size: assetReceived.fileSize ?? 0,
        uri: assetReceived.uri ?? ""
      })
      
    }
  }

  // checks if the save button should be active on every text or image change
  useEffect(() => {
    textChanged();
  }, [form.firstName, form.lastName, form.email, form.profilePictureID])

  //sets up initial values to be put
  useEffect(() => {
    try {
      setisLoading(true)
      const userEmail = userContext?.current?.email!
      if (userEmail) {
        const getProfileDetails = async () => {
          let receivedUserDetails = await getUserDetailsFromEmail(userEmail)
          setUserDetails({
            firstName: receivedUserDetails?.firstName ?? "",
            lastName: receivedUserDetails?.lastName ?? "",
            email: receivedUserDetails?.email ?? "",
            profilePictureID: receivedUserDetails?.profilePictureID ?? "",
            userID: receivedUserDetails?.userID ?? ""
          })

          const profilePicture = generateProfilePictureLink(receivedUserDetails?.profilePictureID!)
          setInitialValues({
            email: receivedUserDetails?.email ?? "",
            firstName: receivedUserDetails?.firstName ?? "",
            lastName: receivedUserDetails?.lastName ?? "",
            userID: receivedUserDetails?.userID ?? "",
            profilePictureID: profilePicture
          })
          setForm({
            email: receivedUserDetails?.email ?? "",
            firstName: receivedUserDetails?.firstName ?? "",
            lastName: receivedUserDetails?.lastName ?? "",
            userID: receivedUserDetails?.userID ?? "",
            profilePictureID: profilePicture
          })
        }
        getProfileDetails()

        setisLoading(false)

      }
    }
    catch (error) {
      console.log(error)
    }
    finally {

    }
  }, [userContext?.current?.email!])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ?
        (<LoadingScreen />)
        :
        (<ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%" }}>
          <View style={styles.headerContainer}>
            <View style={styles.leftHeader}>
              <TouchableOpacity
                onPress={() => router.back()}
              >
                {/* <Text style={styles.backButtonText}> {`<`} </Text> */}
                <AntDesign name="arrowleft" size={34} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Edit Profile</Text>
            </View>
            <Pressable onPress={handleSavePressed} style={[!saveButtonActive && styles.saveButtonDefault, saveButtonActive && styles.saveButtonActive]} disabled={!saveButtonActive}>
              <Text style={[!saveButtonActive && styles.saveTextDefault, saveButtonActive && styles.saveTextActive]}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.mainContainer}>
            <Image style={styles.image} source={{ uri: form.profilePictureID }} />
            <TouchableOpacity style={[{ backgroundColor: Colors.light.gray }, styles.editButton]}
              onPress={handleEditAvatarPress}
            >
              <Text style={{ color: "white", fontWeight: 600 }}>
                Edit
              </Text>
            </TouchableOpacity>
            <View style={styles.namesInputContainer}>
              <CustomInput
                title='First Name'
                error={errorSpot.firstName}
                handleChangeText={(val) => { (setForm({ ...initialValues, firstName: val })) }}
                keyboardType='default'
                value={form.firstName}
                secureText={false}
                additionalStyles={{ flex: 1 }}

              />
              <CustomInput
                title='Last Name'
                error={false}
                handleChangeText={(val) => { setForm({ ...initialValues, lastName: val }) }}
                keyboardType='default'
                value={form.lastName}
                secureText={false}
                additionalStyles={{ flex: 1 }}
              />
            </View>
            <CustomInput
              title='Email'
              error={false}
              handleChangeText={(val) => { setForm({ ...initialValues, email: val }) }}
              keyboardType='email-address'
              value={form.email}
              secureText={false}
              additionalStyles={{ width: "100%" }}
            />
          </View>
        </ScrollView>)
      }

    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftHeader: {
    display: "flex",
    flexDirection: "row",
    flex: 1
  },
  headerText: {
    fontSize: 25,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    paddingLeft: 29
  },

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
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginTop: 20,
    borderRadius: 75
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