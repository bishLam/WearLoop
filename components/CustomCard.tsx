import { TouchableOpacity, StyleSheet, Text, View, Image, Platform } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { cloth, generateClothImageLink } from '@/lib/appwriteFunctions';
import { router } from 'expo-router';

type cardPropsType = {
  cloth: cloth;
};

const handlePress = (cloth: cloth) => {
  router.push({
    pathname: "/clothDetails",
    params: {
      cloth: JSON.stringify(cloth),
    },
  });
};

export const CustomCard = ({ cloth }: cardPropsType) => {
  return cloth.clothUri == "" ? (
    <Text>You do not have any clothes to view here</Text>
  ) : (
    <TouchableOpacity onPress={() => handlePress(cloth)} style={styles.touchable}>
      <View style={styles.cardContainer}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: generateClothImageLink(cloth.documentID) }}
            style={styles.image}
            onError={(e) => console.log("Image error:", e.nativeEvent.error)}
          />
        </View>

        <View style={styles.cardBottomContainer}>
          <Text style={styles.titleText}>{cloth.clothTitle}</Text>
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
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  touchable: {
    flex: 1, // Important: take full space of parent View
    paddingVertical: 10,
    paddingHorizontal:10
  },
  cardContainer: {
    flex: 1, // Important: make card fill the given width
    borderRadius: 10,
    minHeight: 300,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#fff",
    overflow: 'hidden',
    elevation: Platform.OS === "android" ? 1 : 0,
  },
  cardImageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomColor: "cyan",
    borderBottomWidth: 2,
  },
  cardBottomContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 20,
    color: "black",
  },
  descriptionText: {
    fontStyle: "italic",
    fontWeight: "400",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 'auto',
  },
  locationContainer: {
    gap: 10,
  },
});
