"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
// CREATE APPWRITE USER
// export const createUser = async (user: CreateUserParams) => {
//   try {
//     // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
//     const newuser = await users.create(
//       ID.unique(),
//       user.email,
//       user.phone,
//       undefined,
//       user.name
//     );

//     return parseStringify(newuser);
//   } catch (error: any) {
//     // Check existing user
//     if (error && error?.code === 409) {
//       const existingUser = await users.list([
//         Query.equal("email", [user.email]),
//       ]);

//       return existingUser.users[0];
//     }
//     console.error("An error occurred while creating a new user:", error);
//   }
// };

// GET USER
// export const getUser = async (userId: string) => {
//   try {
//     const user = await users.get(userId);

//     return parseStringify(user);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the user details:",
//       error
//     );
//   }
// };

// REGISTER PATIENT
// export const registerPatient = async ({
//   identificationDocument,
//   ...patient
// }: RegisterUserParams) => {
//   try {
//     // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
//     let file;
//     if (identificationDocument) {
//       const inputFile =
//         identificationDocument &&
//         InputFile.fromBlob(
//           identificationDocument?.get("blobFile") as Blob,
//           identificationDocument?.get("fileName") as string
//         );

//       file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
//     }

//     // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
//     const newPatient = await databases.createDocument(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       ID.unique(),
//       {
//         identificationDocumentId: file?.$id ? file.$id : null,
//         identificationDocumentUrl: file?.$id
//           ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
//           : null,
//         ...patient,
//       }
//     );

//     return parseStringify(newPatient);
//   } catch (error) {
//     console.error("An error occurred while creating a new patient:", error);
//   }
// };

// GET PATIENT
// export const getPatient = async (userId: string) => {
//   try {
//     const patients = await databases.listDocuments(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       [Query.equal("userId", [userId])]
//     );

//     return parseStringify(patients.documents[0]);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the patient details:",
//       error
//     );
//   }
// };

export const addPatient = async (patientData) => {
  try {
    console.log(patientData, "patientData");
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        unique_id: ID.unique(),
        name: patientData.name,
        email: patientData.email,
        phone_no: patientData.phone,
        aadhar_card_no: patientData.aadhar_number,
        gender: patientData.gender,
        patient_history: Array.isArray(patientData.patientHistory)
          ? patientData.patientHistory
          : [patientData.patientHistory], // Ensure it's an array        room: patientData.room,
        created_at: new Date().toISOString(),
      }
    );

    console.log(newPatient, "newPatient");
    return parseStringify(newPatient);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingPatient = await databases.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [
          Query.equal("phone", [patientData.phone]) ||
            Query.equal("aadhar_number", [patientData.aadhar_number]),
        ]
      );

      return existingPatient.documents[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// FETCH ALL PATIENTS
export const getAllPatients = async (searchQuery = "") => {
  try {
    let filters: string[] | undefined = [];

    if (searchQuery) {
      filters = [
        Query.startsWith("name", searchQuery),
        Query.startsWith("email", searchQuery),
        Query.startsWith("phone_no", searchQuery),
        Query.startsWith("aadhar_card_no", searchQuery),
      ];
    }

    // Always include sorting by "created_at"
    filters.push(Query.orderDesc("created_at"));

    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.startsWith("name", searchQuery),
        Query.startsWith("email", searchQuery),
        Query.startsWith("phone_no", searchQuery),
        Query.startsWith("aadhar_card_no", searchQuery),
        Query.orderDesc("created_at"),
      ]
    );

    return parseStringify(patients.documents);
  } catch (error) {
    console.error("An error occurred while fetching all patients:", error);
  }
};

// FETCH A SINGLE PATIENT BY ID
export const getPatientById = async (patientId: string) => {
  try {
    const patient = await databases.getDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId
    );

    return parseStringify(patient);
  } catch (error) {
    console.error(
      `An error occurred while fetching the patient with ID ${patientId}:`,
      error
    );
  }
};
