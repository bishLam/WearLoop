import { Account, Databases, Client } from "react-native-appwrite"

//all the projects details about the app. Make sure you do not commit this on github
const config = ({
  endpoint: "https://cloud.appwrite.io/v1",
  projectID : "67da10e7003b52bb1543",
  databaseID: "67da12ea0032e9984461",
  usersCollectionID: "67da13090026a213a6d4" ,
  packageName: "au.edu.nsw.ait"
})

const client = new Client ()
  .setProject(config.projectID)
  .setPlatform(config.packageName)
  .setEndpoint(config.endpoint)

export const account = new Account(client)
export const database = new Databases(client)
