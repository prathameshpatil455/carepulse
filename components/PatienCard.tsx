"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PatientData {
  name: string;
  aadhar_card_no: string;
  unique_id: string;
  gender: string;
  created_at: string;
  admitted_at: string;
  discharged_at: string | null;
  assigned_room_id: string | null;
  patient_history: string[];
  email: string;
  phone_no: string;
}

const PatientCard: React.FC<{ patient: PatientData }> = ({ patient }) => {
  const router = useRouter();

  return (
    <div
      className="p-4 bg-gray-800 shadow-md rounded-xl border border-gray-800 w-full max-w-[800px] text-[#ffffff] cursor-pointer"
      onClick={() => {
        router.push(`/patients/${patient.$id}/patientData`);
      }}
    >
      <h2 className="text-xl font-bold text-white mb-2">{patient.name}</h2>
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Aadhar Card No:</strong>{" "}
        {patient.aadhar_card_no}
      </p>
      {/* <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Unique ID:</strong>{" "}
        {patient.unique_id}
      </p> */}
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Gender:</strong> {patient.gender}
      </p>
      {/* <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Admitted At:</strong>{" "}
        {new Date(patient.admitted_at).toLocaleString()}
      </p>
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Discharged At:</strong>{" "}
        {patient.discharged_at
          ? new Date(patient.discharged_at).toLocaleString()
          : "N/A"}
      </p> */}
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Assigned Room:</strong>{" "}
        {patient.assigned_room_id || "Not Assigned"}
      </p>
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Email:</strong> {patient.email}
      </p>
      <p className="text-sm text-gray-300 mb-1">
        <strong className="text-gray-400">Phone:</strong> {patient.phone_no}
      </p>
      <div className="mt-3">
        <strong className="text-sm text-gray-400">Patient History:</strong>
        <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
          {patient.patient_history.map((history, index) => (
            <li key={index}>{history}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientCard;
