/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  ROOM_COLLECTION_ID,
  ROOM_ASSIGNMENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createRoom = async (roomData) => {
  try {
    const newRoom = await databases.createDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      ID.unique(),
      {
        room_nnumber: roomData.room_number,
        room_type: roomData.room_type,
        is_available: true,
        created_at: new Date().toISOString(),
        assigned_patient_id: null,
      }
    );

    console.log(newRoom, "newRoom");
    return parseStringify(newRoom);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingRoom = await databases.listDocuments(
        DATABASE_ID!,
        ROOM_COLLECTION_ID!,
        [Query.equal("room_nnumber", [roomData.room_number])]
      );

      return existingRoom.documents[0];
    }
    console.error("An error occurred while creating a new room:", error);
  }
};

export const assignPatientToRoom = async (patientId, roomNumber) => {
  try {
    const room = await databases.updateDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomNumber,
      {
        is_available: false,
        assigned_patient_id: patientId,
      }
    );

    console.log(room, "room");

    const roomAssignment = await databases.createDocument(
      DATABASE_ID!,
      ROOM_ASSIGNMENT_COLLECTION_ID!,
      ID.unique(),
      {
        room_id: roomNumber,
        patient_id: patientId,
        assigned_at: new Date().toISOString(),
        discharged_at: null,
        discharge_summary: null,
      }
    );
    console.log(roomAssignment, "roomAssignment");
    const result = [parseStringify(room), parseStringify(roomAssignment)];
    return result;
    // return parseStringify(room);
  } catch (error: any) {
    console.error("An error occurred while updating the room:", error);
  }
};

export const dischargePatientFromRoom = async (
  patientId,
  roomNumber,
  dischargeSummary
) => {
  try {
    const room = await databases.updateDocument(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      roomNumber,
      {
        is_available: true,
        assigned_patient_id: null,
      }
    );

    console.log(room, "room");

    const roomAssignment = await databases.updateDocument(
      DATABASE_ID!,
      ROOM_ASSIGNMENT_COLLECTION_ID!,
      roomNumber,
      {
        discharged_at: new Date().toISOString(),
        discharge_summary: dischargeSummary,
      }
    );

    console.log(roomAssignment, "roomAssignment");
    const result = [parseStringify(room), parseStringify(roomAssignment)];
    return result;
    // return parseStringify(room);
  } catch (error: any) {
    console.error("An error occurred while updating the room:", error);
  }
};

// FETCH ALL PATIENTS
export const getAvailableRooms = async () => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("is_available", [true])]
    );

    return parseStringify(rooms.documents);
  } catch (error) {
    console.error("An error occurred while fetching all patients:", error);
  }
};

export const getAllRooms = async () => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      []
    );

    return parseStringify(rooms.documents);
  } catch (error) {
    console.error("An error occurred while fetching all patients:", error);
  }
};

export const getOccupiedRooms = async () => {
  try {
    const rooms = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_COLLECTION_ID!,
      [Query.equal("is_available", [false])]
    );

    return parseStringify(rooms.documents);
  } catch (error) {
    console.error("An error occurred while fetching all patients:", error);
  }
};

// FETCH A SINGLE PATIENT BY ID
// export const getPatientById = async (patientId: string) => {
//   try {
//     const patient = await databases.getDocument(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       patientId
//     );

//     return parseStringify(patient);
//   } catch (error) {
//     console.error(
//       `An error occurred while fetching the patient with ID ${patientId}:`,
//       error
//     );
//   }
// };

export const getPatientRoomHistory = async (patientId: string) => {
  try {
    const roomAssignments = await databases.listDocuments(
      DATABASE_ID!,
      ROOM_ASSIGNMENT_COLLECTION_ID!,
      [Query.equal("patient_id", [patientId])]
    );

    return parseStringify(roomAssignments.documents);
  } catch (error) {
    console.error(
      `An error occurred while fetching the patient with ID ${patientId}:`,
      error
    );
  }
};
