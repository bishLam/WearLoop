import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform as RNPlatform,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { addClothImageToBucket, addClothImageToBucketWeb, addClothToDatabase } from '@/lib/appwriteFunctions';
import Toast from '@/components/toast';
import { defaultImage } from '@/constants/defaultImage';
import { Colors } from '@/constants/Colors';
import { ID } from 'react-native-appwrite';
import { useUser } from '@/contexts/UserAuth';


const Create = () => {
  const userContext = useUser();
  const [imageUri, setImageUri] = useState("");
  const [imageMeta, setImageMeta] = useState({
    name: "",
    type: "",
    size: 0,
  });
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [webFile, setWebFile] = useState<File>();

  const categories = [
    { label: 'Shirts', value: 'Shirts' },
    { label: 'Shoes', value: 'Shoes' },
    { label: 'Pants', value: 'Pants' },
  ];

  const conditions = [
    { label: 'New', value: 'New' },
    { label: 'Barely Worn', value: 'Barely Worn' },
    { label: 'Used', value: 'Used' },
  ];

  const handleImagePickerPress = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Media access permission required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
        allowsEditing: true
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageMeta({
          name: asset.fileName ?? `cloth_${Date.now()}.jpg`,
          type: asset.mimeType ?? 'image/jpeg',
          size: asset.fileSize ?? 1,
        });
      }
    }
    else if (Platform.OS === "web") {
      document.getElementById("fileImageSelecter")?.click()
    }
  }

  const handleWebImagePress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      setWebFile(file)
      setImageUri(URL.createObjectURL(file))
      setImageMeta({
        name: file.name,
        type: file.type,
        size: file.size
      })
    }
  }


  const handleFormSubmit = async () => {
    if (!imageMeta.name || !gender || !category || !condition || !imageUri || !title) {
      Toast('Please fill all required fields.');
      return;
    }

    try {
      setUploading(true)
      if (Platform.OS === "web" && webFile) {
        var id = ID.unique()
        
        await addClothToDatabase(
          title,
          description,
          id,
          gender,
          condition,
          category,
          Number(postalCode),
          userContext?.current?.email ?? ""
        )
        await addClothImageToBucketWeb(webFile!, id)
        Toast('✅ Upload successful!');
        router.replace('/home');
      }
      else {
        var id = ID.unique()
        await addClothToDatabase(
          title,
          description,
          id,
          gender,
          condition,
          category,
          Number(postalCode),
          userContext?.current?.email ?? ""
        )
        await addClothImageToBucket({
          name: imageMeta.name,
          type: imageMeta.type,
          size: imageMeta.size,
          uri: imageUri
        }, id)
        Toast('✅ Upload successful!');
        router.replace('/home');
      }
    }
    catch (error) {
      Toast('Upload Error' + error);
      console.log(error)

    } finally {
      setUploading(false);
      setImageUri('');
      setImageMeta({
        name: '',
        type: '',
        size: 0,
      });
      setGender('');
      setCategory('');
      setCondition('');
      setDescription('');
      setWebFile(undefined);
      if (Platform.OS === "web") {
        const fileInput = document.getElementById("fileImageSelecter") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%" }}>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              {/* button to go back to the previous page */}
              {Platform.OS === "android" || Platform.OS === "ios" ?
                <>
                  {/* <TouchableOpacity style={styles.backButton}
                    onPress={() => router.replace("/home")}
                  >
                  
                    <AntDesign name="arrowleft" size={34} color="black" />
                  </TouchableOpacity> */}
                  <Text style={styles.headerText}>Upload a cloth</Text>
                </> :
                <input type="file"
                  id='fileImageSelecter'
                  style={{ display: "none" }}
                  onChange={handleWebImagePress}

                />
              }

            </View>
            {/* View with image and buttons to change the image */}
            <View>
              {Platform.OS === "web" ?

                <img style={styles.image} src={imageUri ? imageUri : defaultImage} alt="image" />
                :
                <Image
                  style={styles.image}
                  source={
                    imageUri ? {
                      uri: imageUri
                    } :
                      { uri: defaultImage }}
                />
              }


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

            <View style={styles.titleInputSectionContainer}>
              <Text style={styles.titleText}>
                Cloth Title*
              </Text>
              <TextInput 
              style = {styles.clothTitleTextInput}
              value={title}
              onChangeText={(e) => setTitle(e)}
              maxLength={50}
              />
                
            </View>

            {/* View to set the cloth details */}
            <View style={styles.genderContainer}>
              {/* horizontal view to set the gender */}
              <Text style={styles.titleText}>Select a gender*</Text>
              <View style={styles.genderButtons}>
                <Pressable style={[gender === "male" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => setGender("male")}
                >
                  <Text style={{ textAlign: "center" }}>Male</Text>
                </Pressable>
                <Pressable style={[gender === "female" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => setGender("female")}
                >
                  <Text style={{ textAlign: "center" }}>Female</Text>
                </Pressable>
                <Pressable style={[gender === "other" && styles.activeGender && { backgroundColor: Colors.light.cyan }, styles.gender]}
                  onPress={() => setGender("other")}
                >
                  <Text style={{ textAlign: "center" }}>Other</Text>
                </Pressable>
              </View>
            </View>


            {/* View to select Category */}
            <View style = {styles.categoryConditionContainer}>
              <View style = {styles.categoryContainer}>
                <Text style={styles.titleText}>Select Category*</Text>
                <Dropdown
                  style={[{ borderBlockColor: Colors.light.gray }, styles.dropdownContainer]}
                  mode="default"
                  data={categories}
                  onChange={(e) => { setCategory(e.value) }}
                  labelField={'label'}
                  valueField={'value'}
                  value={category}
                  activeColor={Colors.light.cyan}

                />
              </View>

              {/* View to select conditions */}
              <View style = {styles.categoryContainer}>
                <Text style={styles.titleText}>Select Condition*</Text>
                <Dropdown
                  style={[{ borderBlockColor: Colors.light.gray }, styles.dropdownContainer]}
                  mode='default'
                  data={conditions}
                  onChange={(e) => { setCondition(e.value) }}
                  labelField={'label'}
                  valueField={'value'}
                  value={condition}
                  activeColor={Colors.light.cyan}
                />
              </View>
            </View>
            {/* Description container */}
            <View style={styles.titleInputSectionContainer}>
              <Text style={styles.titleText}>Description*</Text>
              <TextInput
                multiline
                numberOfLines={6}
                placeholder="Enter description for your cloth"
                style={styles.descriptionInput}
                scrollEnabled
                value={description}
                submitBehavior="newline"
                onChangeText={(e) => { setDescription(e) }}
              />
            </View>
            {/* Postal Code Input Section */}
            <View style={styles.titleInputSectionContainer}>
            <Text style={styles.titleText}>Enter Postal Code*</Text>
            <TextInput 
              style = {styles.clothTitleTextInput}
              autoComplete='postal-code'
              keyboardType='numeric'
              value={postalCode}
              placeholder='Enter your postal address'
              maxLength={5}
              onChangeText={(e) => setPostalCode(e)}
              />
            </View>
            {/* submit button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors.light.lime }]}
              onPress={handleFormSubmit}
              disabled={uploading}
            >
              {uploading ?
              <>
                <ActivityIndicator
                  color={Colors.light.white}
                />
                <Text style={styles.submitButtonText}>Uploading</Text>
                </>
                :
                <Text style={styles.submitButtonText}>Upload</Text>
              }
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 20
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
  titleInputSectionContainer:{
    display:"flex",
    flexDirection:"column",
    gap: 10
  },

  clothTitleTextInput:{
    borderColor: "black",
    borderWidth:1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius:10,
  },

  genderContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5
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

  categoryConditionContainer:{
    display:"flex",
    flexDirection:"row",
    gap: 10,
    justifyContent:"space-between"
  },
  categoryContainer: {
    flex:1,
    display: "flex",
    flexDirection: "column",
    gap: 5
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  descriptionInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 100
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
  }
})