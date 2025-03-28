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
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { database, storage, config } from '@/lib/appwrite';
import { ID, Permission, Role } from 'react-native-appwrite';
import { Platform } from 'react-native';

let WebAppwrite: any = null;
if (RNPlatform.OS === 'web') {
  WebAppwrite = require('appwrite'); // appwrite web sdk
}

const Create = () => {
  const [imageUri, setImageUri] = useState('');
  const [imageBlob, setImageBlob] = useState<any>(null); // For Web
  const [imageMeta, setImageMeta] = useState({
    name: '',
    type: '',
    size: 0,
  });
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
<<<<<<< HEAD
  // const fileInputRef = useRef<any>();
=======
  const fileInputRef = useRef<any>();
>>>>>>> 4eb552cfcab3a62e0bec23f5cff514e1288892ff

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

  const pickImage = async () => {
<<<<<<< HEAD
    // if (RNPlatform.OS === 'web') {
    //   fileInputRef.current?.click();
    // } else {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast('Media access permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: "images",
      quality: 1
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
    // }
  };

  // const handleWebFile = (e: any) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageUri(URL.createObjectURL(file));
  //     setImageBlob(file);
  //     setImageMeta({
  //       name: file.name,
  //       type: file.type,
  //       size: file.size,
  //     });
  //   }
  // };
=======
    if (RNPlatform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Media access permission required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageMeta({
          name: asset.fileName ?? `cloth_${Date.now()}.jpg`,
          type: asset.type ?? 'image/jpeg',
          size: asset.fileSize ?? 1,
        });
      }
    }
  };

  const handleWebFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageUri(URL.createObjectURL(file));
      setImageBlob(file);
      setImageMeta({
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };
>>>>>>> 4eb552cfcab3a62e0bec23f5cff514e1288892ff

  const handleSubmit = async () => {
    if (!imageMeta.name || !gender || !category || !condition) {
      alert('Please fill all required fields.');
      return;
    }

    setUploading(true);
<<<<<<< HEAD
    try {
      await addClothToDatabase({
        name: imageMeta.name,
        type: imageMeta.type,
        size: imageMeta.size,
        uri: imageUri
      })
    }
    catch (error) {
      console.log("error: ", error)
      Toast("error: "+ error)
    }

    finally {
      setUploading(false)
    }

    // try {
    //   let uploadedFile;

    //   if (RNPlatform.OS === 'web') {
    //     const client = new WebAppwrite.Client()
    //       .setEndpoint(config.endpoint)
    //       .setProject(config.projectID);

    //     const storageWeb = new WebAppwrite.Storage(client);

    //     uploadedFile = await storageWeb.createFile(
    //       config.bucketID,
    //       ID.unique(),
    //       imageBlob,
    //       [WebAppwrite.Permission.read(WebAppwrite.Role.any())]
    //     );
    //   } else {
    //     uploadedFile = await storage.createFile(
    //       config.bucketID,
    //       ID.unique(),
    //       {
    //         uri: imageUri,
    //         name: imageMeta.name,
    //         type: imageMeta.type,
    //         size: imageMeta.size,
    //       },
    //       [Permission.read(Role.any()), Permission.write(Role.user('current'))]
    //     );
    //   }

    //   await database.createDocument(
    //     config.databaseID,
    //     config.ProductCollectionID,
    //     ID.unique(),
    //     {
    //       Image: uploadedFile.$id,
    //       Gender: gender,        
    //       Category: category,     
    //       Condition: condition,   
    //       Description: description 
    //     }
    //   );

    //   alert('✅ Upload successful!');
    //   router.replace('/home');
    // } catch (err: any) {
    //   console.error('❌ Upload failed:', err);
    //   alert(err.message || 'Upload failed');
    // } finally {
    //   setUploading(false);
    // }
=======

    try {
      let uploadedFile;

      if (RNPlatform.OS === 'web') {
        const client = new WebAppwrite.Client()
          .setEndpoint(config.endpoint)
          .setProject(config.projectID);

        const storageWeb = new WebAppwrite.Storage(client);

        uploadedFile = await storageWeb.createFile(
          config.bucketID,
          ID.unique(),
          imageBlob,
          [WebAppwrite.Permission.read(WebAppwrite.Role.any())]
        );
      } else {
        uploadedFile = await storage.createFile(
          config.bucketID,
          ID.unique(),
          {
            uri: imageUri,
            name: imageMeta.name,
            type: imageMeta.type,
            size: imageMeta.size,
          },
          [Permission.read(Role.any()), Permission.write(Role.user('current'))]
        );
      }

      await database.createDocument(
        config.databaseID,
        config.ProductCollectionID,
        ID.unique(),
        {
          Image: uploadedFile.$id,
          Gender: gender,        
          Category: category,     
          Condition: condition,   
          Description: description 
        }
      );

      alert('✅ Upload successful!');
      router.replace('/home');
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
>>>>>>> 4eb552cfcab3a62e0bec23f5cff514e1288892ff
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={30} />
          </TouchableOpacity>

          <Text style={styles.header}>Upload Cloth</Text>

          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : { uri: 'https://placehold.co/150x150?text=No+Image' }
              }
              style={styles.image}
            />
          </TouchableOpacity>
<<<<<<< HEAD
          {/* 
=======

>>>>>>> 4eb552cfcab3a62e0bec23f5cff514e1288892ff
          {RNPlatform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleWebFile}
            />
<<<<<<< HEAD
          )} */}
=======
          )}
>>>>>>> 4eb552cfcab3a62e0bec23f5cff514e1288892ff

          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, gender === g && styles.activeChip]}
                onPress={() => setGender(g)}
              >
                <Text>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Category</Text>
          <Dropdown
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Select category"
            value={category}
            onChange={(item) => setCategory(item.value)}
            style={styles.dropdown}
          />

          <Text style={styles.label}>Condition</Text>
          <Dropdown
            data={conditions}
            labelField="label"
            valueField="value"
            placeholder="Select condition"
            value={condition}
            onChange={(item) => setCondition(item.value)}
            style={styles.dropdown}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            placeholder="Write a short description"
          />

          <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Upload</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Create;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#d1e7dd',
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  submit: {
    backgroundColor: '#3d7cf7',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
