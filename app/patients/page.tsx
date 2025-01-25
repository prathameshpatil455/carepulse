import PatientCard from "@/components/PatienCard";
import RoomBooking from "@/components/RoomBooking";
import { getAllPatients } from "@/lib/actions/patient.actions";
import {
  getAllRooms,
  getAvailableRooms,
  getOccupiedRooms,
} from "@/lib/actions/rooms.actions";
import React from "react";

const page = async () => {
  const AllPatientsData = await getAllPatients();
  const AvailableRooms = await getAvailableRooms();
  const AllRooms = await getAllRooms();
  const OccupiedRooms = await getOccupiedRooms();

  console.log(AllRooms, "AllRooms");
  console.log(AvailableRooms, "AvailableRooms");
  console.log(OccupiedRooms, "OccupiedRooms");

  return (
    <div className="flex min-h-screen bg-gray-700 gap-4 p-4">
      <div className="flex flex-col gap-4 max-w-[500px] w-full overflow-auto">
        <h2 className="text-2xl px-2 font-semibold">Patients List</h2>
        {(AllPatientsData || []).map((patientData, index) => (
          <PatientCard
            key={patientData.unique_id || index}
            patient={patientData}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 max-w-[500px] w-full overflow-auto p-2">
        <h2 className="text-2xl px-2 font-semibold">Hospital Info</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Total Rooms: {AllRooms.length}</p>
          <p>Available Rooms: {AvailableRooms.length}</p>
          <p>Occupied Rooms: {OccupiedRooms.length}</p>
        </div>
      </div>
    </div>
  );
};

export default page;
