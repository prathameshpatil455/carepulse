/* eslint-disable @next/next/no-async-client-component */
"use client";

import PatientCard from "@/components/PatientCard";
import RoomBooking from "@/components/RoomBooking";
import { getAllPatients } from "@/lib/actions/patient.actions";
import {
  getAllRooms,
  getAvailableRooms,
  getOccupiedRooms,
} from "@/lib/actions/rooms.actions";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);

  // Fetch room-related data once on component mount
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const [
          allRoomsData,
          availableRoomsData,
          occupiedRoomsData,
          allPatients,
        ] = await Promise.all([
          getAllRooms(),
          getAvailableRooms(),
          getOccupiedRooms(),
          getAllPatients(),
        ]);

        setAllRooms(allRoomsData || []);
        setAvailableRooms(availableRoomsData || []);
        setOccupiedRooms(occupiedRoomsData || []);
        setPatients(allPatients || []);
      } catch (error) {
        console.error("An error occurred while fetching room data:", error);
      }
    };

    fetchRoomData();
  }, []);

  // Fetch patients only when the button is clicked
  const fetchPatients = async () => {
    try {
      const allPatients = await getAllPatients(searchQuery);
      setPatients(allPatients || []);
    } catch (error) {
      console.error("An error occurred while fetching patients:", error);
    }
  };
  console.log(patients, "Patients");
  console.log(allRooms, "AllRooms");
  console.log(availableRooms, "AvailableRooms");
  console.log(occupiedRooms, "OccupiedRooms");

  return (
    <div className="flex justify-between min-h-screen bg-gray-700 gap-4 p-4">
      <div className="flex flex-col gap-4 max-w-[500px] w-full overflow-auto">
        <h2 className="text-2xl px-2 font-semibold">Patients List</h2>
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by Aadhar, Name, or Phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
          <button
            onClick={fetchPatients}
            className="ml-2 p-2 max-w-[100px] bg-blue-500 text-white rounded-lg w-full"
          >
            Search
          </button>
        </div>
        {(patients || []).map((patientData, index) => (
          <PatientCard key={patientData.$id || index} patient={patientData} />
        ))}
      </div>

      <div className="flex flex-col gap-4 max-w-[500px] w-full overflow-auto p-2">
        <h2 className="text-2xl px-2 font-semibold">Hospital Info</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Total Rooms: {allRooms.length}</p>
          <p>Available Rooms: {availableRooms.length}</p>
          <p>Occupied Rooms: {occupiedRooms.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
