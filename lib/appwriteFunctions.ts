import { Query } from "appwrite"
import { client, config, database, storage, storageWeb } from "./appwrite"
import { ID } from "react-native-appwrite"

export const addUserToCollection = async (firstName:string, lastName:string, email:string) => {
  await database.createDocument(config.databaseID, config.usersCollectionID, ID.unique(), {
   firstName:firstName,
   lastName:lastName,
   email:email
 } )
}

type fileType = {
 name: string,
 type: string,
 size: number,
 uri: string
} 
type documentType = {
 description: string,
 imageID:string,
 gender:string, 
 condition:string,
 category:string
}
export const addClothImageToBucket = async (file:fileType, imageID:string) => {
   let response = await storage.createFile(config.clothesBucketID, imageID, file)
  //  console.log(response)
}

export const addClothImageToBucketWeb = async (file:File, imageID:string) => {
 let response = await storageWeb.createFile(config.clothesBucketID, imageID, file)
//  console.log(response)
}

export const addClothToDatabase = async (description: string, imageID: string, gender:string, condition:string, category:string) => {
 let response = await database.createDocument(config.databaseID, config.productCollectionID, imageID, {
   description: description,
   imageID: imageID, 
   gender:gender,
   condition:condition,
   category:category,
   isActive: true,
   postalCode: 1111
 } )
}

export type cloth = {
  documentID:string,
  imageID: string,
  description: string,
  isActive: boolean,
  condition:string,
  category:string,
  postalCode:string,
  createdDate: string,
  gender:string,
  clothUri:string,
}

export const listAllActiveClothes = async () => {
  let response = await database.listDocuments(config.databaseID, config.productCollectionID, [
    Query.equal('isActive', true)
  ])
  let documents = response.documents;
  let clothDetails : cloth[] = []

  try{
  for(const document of documents){
  let dataRow = await database.getDocument(config.databaseID, config.productCollectionID, document.$id);
  let imagePreview = storage.getFilePreview(config.clothesBucketID, document.imageID);
  let singleCloth:cloth = {
      documentID : dataRow.$id,
      imageID: dataRow.imageID,
      description: dataRow.description,
      isActive: dataRow.isActive,
      condition:dataRow.condition,
      postalCode: dataRow.postalCode,
      category: dataRow.category,
      createdDate:dataRow.$createdAt,
      gender:dataRow.gender,
      clothUri: imagePreview.toString()
    }

    clothDetails.push(singleCloth)
  }
  // console.log(clothDetails.length)
return clothDetails
}
catch(error){
  console.log(error)
}
};

export const listenForChanges = (callback: (newCloth: cloth) => void) => {
  client.subscribe(`databases.${config.databaseID}.collections.${config.productCollectionID}.documents`, response => {
      console.log(response)
      const eventType = response.events[0]
      console.log(eventType + " event type")
      if(eventType.includes("create")) {
        console.log(`${response.payload} new payload added \n`)
        let imageUri = storage.getFilePreview(config.clothesBucketID, config.payload.$id)
          // Log when a new file is uploaded
          let newCloth:cloth = {
            documentID: response.payload.$id,
            imageID: response.payload.imageID,
            description: response.payload.description,
            isActive: response.payload.isActive,
            condition: response.payload.condition,
            postalCode: response.payload.postalCode,
            createdDate: response.payload.$createdAt,
            gender: response.payload.gender,
            category: response.payload.category,
            clothUri: imageUri.toString()
          };
          callback(newCloth)
      }
  })
}
