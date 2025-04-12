import { Query } from "appwrite"
import { client, config, database, storage, storageWeb } from "./appwrite"
import { ID } from "react-native-appwrite"
import { defaultImage } from "@/constants/defaultImage"



export type cloth = {
  documentID: string,
  clothTitle: string,
  imageID: string,
  description: string,
  isActive: boolean,
  condition: string,
  category: string,
  postalCode: string,
  createdDate: string,
  gender: string,
  clothUri: string,
  uploaderID: string
}

export type fileType = {
  name: string,
  type: string,
  size: number,
  uri: string
}

export type userType = {
  email: string,
  firstName: string,
  lastName: string,
  profilePictureID: string,
  userID:string
}

export const addUserToCollection = async (firstName: string, lastName: string, email: string) => {
  await database.createDocument(config.databaseID, config.usersCollectionID, ID.unique(), {
    firstName: firstName,
    lastName: lastName,
    email: email
  })
}

export const addClothImageToBucket = async (file: fileType, imageID: string) => {
  await storage.createFile(config.clothesBucketID, imageID, file)
  //  console.log(response)
}

export const addClothImageToBucketWeb = async (file: File, imageID: string) => {
  let response = await storageWeb.createFile(config.clothesBucketID, imageID, file)
  //  console.log(response)
}

export const addClothToDatabase = async (clothTitle: string, description: string, imageID: string, gender: string, condition: string, category: string, postalCode: number, uploaderID: string) => {
  let response = await database.createDocument(config.databaseID, config.productCollectionID, imageID, {
    description: description,
    imageID: imageID,
    gender: gender,
    condition: condition,
    category: category,
    isActive: true,
    postalCode: postalCode,
    title: clothTitle,
    uploaderID: uploaderID
  })
}



export const listAllActiveClothes = async () => {
  let response = await database.listDocuments(config.databaseID, config.productCollectionID, [
    Query.equal('isActive', true)
  ])
  let documents = response.documents;
  let clothDetails: cloth[] = []

  try {
    for (const document of documents) {
      let dataRow = await database.getDocument(config.databaseID, config.productCollectionID, document.$id);
      let imagePreview = storage.getFilePreview(config.clothesBucketID, document.imageID);
      let singleCloth: cloth = {
        documentID: dataRow.$id,
        clothTitle: dataRow.title,
        imageID: dataRow.imageID,
        description: dataRow.description,
        isActive: dataRow.isActive,
        condition: dataRow.condition,
        postalCode: dataRow.postalCode,
        category: dataRow.category,
        createdDate: dataRow.$createdAt,
        gender: dataRow.gender,
        clothUri: imagePreview.toString(),
        uploaderID: dataRow.uploaderID
      }

      clothDetails.push(singleCloth)
    }
    // console.log(clothDetails.length)
    return clothDetails
  }
  catch (error) {
    console.log(error)
  }
};

export const listenForChanges = (callback: (newCloth: cloth) => void) => {
  console.log("listenForChanges function called")
  client.subscribe(`databases.${config.databaseID}.collections.${config.productCollectionID}.documents`, response => {
    console.log(response)
    const eventType = response.events[0]
    console.log(eventType + " event type")
    if (eventType.includes("create")) {
      console.log(`${response.payload} new payload added \n`)
      let imageUri = storage.getFilePreview(config.clothesBucketID, config.payload.$id)
      // Log when a new file is uploaded
      let newCloth: cloth = {
        documentID: response.payload.$id,
        imageID: response.payload.imageID,
        description: response.payload.description,
        isActive: response.payload.isActive,
        condition: response.payload.condition,
        postalCode: response.payload.postalCode,
        createdDate: response.payload.$createdAt,
        gender: response.payload.gender,
        category: response.payload.category,
        clothUri: imageUri.toString(),
        clothTitle: response.payload.title,
        uploaderID: response.payload.uploaderID
      };
      callback(newCloth)
    }
  })
}

export const generateClothImageLink = (documentID: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${config.clothesBucketID}/files/${documentID}/view?project=67da10e7003b52bb1543&mode=admin`
}

export const generateProfilePictureLink = (documentID: string) => {
  // console.log(`https://cloud.appwrite.io/v1/storage/buckets/${config.userImageBucketID}/files/${documentID}/view?project=67da10e7003b52bb1543&mode=admin`)
  return `https://cloud.appwrite.io/v1/storage/buckets/${config.userImageBucketID}/files/${documentID}/view?project=67da10e7003b52bb1543&mode=admin`
}

export const getUserDetailsFromEmail = async (email: string) => {
  try {
    let response = await database.listDocuments(config.databaseID, config.usersCollectionID, [
      Query.equal("email", email)
    ])
    let document = response.documents[0]

    let user = {
      email: email,
      firstName: document.firstName,
      lastName: document.lastName,
      profilePictureID: document.pictureID,
      userID:document.$id
    }
    return user

  }
  catch (error) {
    console.log("Error: ", error)
  }

}

export const getTotalPostsByUserFromEmail = async (email: string) => {
  let response = await database.listDocuments(config.databaseID, config.productCollectionID, [
    Query.equal("uploaderID", email)
  ])
  return response.documents.length
}

export const updateUserProfilePicture = async (fileID: string, image: fileType) => {
  const response = storage.updateFile(config.clothesBucketID, fileID,)
}

export const updateUserDetails = async (documentID: string, pictureID: string, firstName?: string, lastName?: string, email?: string) => {
  try {
    const response = await database.updateDocument(config.databaseID, config.usersCollectionID, documentID, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      pictureID: pictureID
    })

  }

  catch (error) {
    console.log(error)
  }
}

export const addUserImageToBucket = async (file: fileType, imageID: string) => {
  await storage.createFile(config.userImageBucketID, imageID, file)
  //  console.log(response)
}

export const deleteModifiedImageFromBucket = async (imageID: string) => {
  await storage.deleteFile(config.userImageBucketID, imageID)
}


