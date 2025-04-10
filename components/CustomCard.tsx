import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Platform, Image } from 'react-native'
import { Colors } from '@/constants/Colors'
import { defaultClothImage } from '@/constants/defaultImage'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { cloth } from '@/lib/appwriteFunctions'
import {router } from 'expo-router'


type cardPropsType = {
  cloth: cloth
}
const handlePress = (cloth:cloth) => {
  router.push({
    pathname: "/(tabs)/clothDetails",
    params: {
      cloth: JSON.stringify(cloth)
    }
  })
}

export const CustomCard = ({ cloth }: cardPropsType) => {
  return (
    <TouchableOpacity onPress={() => handlePress(cloth)}>
      <View style={
        [Platform.OS === "android" || Platform.OS === "ios" ? styles.phoneCardContainer : styles.webCardContainer,
        ]}>
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: defaultClothImage }} //imageUri is not supported on free plan. So using a default image for all the cloths
            style={styles.image}
            onError={(e) => console.log("Image error:", e.nativeEvent.error)}
          />
        </View>

        <View style={styles.cardBottomContainer}>
          <Text style={styles.titleText}>{cloth.category}</Text>
          <Text style={styles.descriptionText}>{cloth.description}</Text>
          <View style={styles.footerContainer}>
            <View style={styles.locationContainer}>
              <Text>{cloth.postalCode}</Text>
              <Text>{cloth.condition}</Text>
            </View>
            <View>
              <MaterialCommunityIcons size={28} color={Colors.light.lime} name="facebook-messenger" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CustomCard

const styles = StyleSheet.create({
  phoneCardContainer: {
    width: 200,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 300,
    borderColor: "gray",
    borderWidth: 1,
  },

  webCardContainer: {
    width: 360,
    borderRadius: 10,
    marginBottom: 20,
    height: 300,
    borderColor: "gray",
    borderWidth: 1,
  },

  cardImageContainer: {
    maxWidth: "100%",
  },

  image: {
    flex: 1,
    height:150,
    width:"100%",
    resizeMode: "contain",
    borderBottomColor: "red",
    paddingVertical: 10,
    borderBottomWidth: 2,

  },

  cardBottomContainer: {
    flex: 1,
    flexDirection: "column",
    gap:20,
    paddingVertical:5,
    paddingHorizontal:10,
  },

  titleText: {
    fontSize: 20,
    color: "black"
  },
  descriptionText:{
    fontStyle:"italic",
    fontWeight:"400"
  },

  footerContainer: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    bottom:0
  },
  locationContainer: {
    gap:10
  }
})