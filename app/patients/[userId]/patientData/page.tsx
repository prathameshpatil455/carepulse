"use client";

import React, { use, useEffect, useState } from "react";
import { getPatientById } from "@/lib/actions/patient.actions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { SendMessageForm } from "@/components/SendMessageForm";
import { Button } from "@/components/ui/button";
import { sendSMSNotification } from "@/lib/actions/appointment.actions";
import {
  assignPatientToRoom,
  getAvailableRooms,
} from "@/lib/actions/rooms.actions";
import RoomBooking from "@/components/RoomBooking";

const PatientDetailsPage = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [modalAction, setModalAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientData = await getPatientById(userId);
        setPatient(patientData);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
      }
    };

    const fetchAvailableRooms = async () => {
      // Fetch available rooms (you'll need to implement this in your backend)
      try {
        const rooms = await getAvailableRooms(); // Assuming this is a function to fetch available rooms
        setAvailableRooms(rooms);
      } catch (error) {
        console.error("Failed to fetch available rooms:", error);
      }
    };

    fetchPatient();
    fetchAvailableRooms();
  }, [userId]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room); // Set the selected room
    console.log("Selected Room:", room);
  };

  const getModalContent = () => {
    switch (modalAction) {
      case "sendMessage":
        return <SendMessageForm patient={patient} />;
      case "admit":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select a Room</h3>
            <RoomBooking
              rooms={availableRooms}
              onRoomSelect={handleRoomSelect}
            />{" "}
            {/* Render the RoomBooking component with available rooms */}
            <div className="mt-4">
              {selectedRoom && (
                <p>
                  <strong>Selected Room:</strong> {selectedRoom.room_number}
                </p>
              )}
              <Button
                onClick={handleAdmit}
                disabled={!selectedRoom} // Disable button if no room is selected
              >
                Admit Patient
              </Button>
            </div>
          </div>
        );
      case "discharge":
        return <DischargeForm patient={patient} />;
      default:
        return null;
    }
  };

  const handleAdmit = async () => {
    if (selectedRoom) {
      try {
        const result = await assignPatientToRoom(patient.id, selectedRoom);
        console.log("Patient admitted:", result);
        setModalAction(null); // Close the modal
      } catch (error) {
        console.error("Failed to admit patient:", error);
      }
    }
  };

  console.log(patient, "patient");

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>

      {patient ? (
        <div className="text-white p-6 rounded-lg shadow-lg">
          <p>
            <strong>Name:</strong> {patient.name}
          </p>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone_no}
          </p>
          <p>
            <strong>Aadhar Card No:</strong> {patient.aadhar_card_no}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(patient.created_at).toLocaleString()}
          </p>
          <div className="flex gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={() => setModalAction("sendMessage")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Send Message
                </button>
              </DialogTrigger>
              <DialogContent className="shad-dialog sm:max-w-md">
                <DialogHeader className="mb-4 space-y-3">
                  <DialogTitle className="capitalize">Send Message</DialogTitle>
                  <DialogDescription>
                    Please fill in the following Message to send to{" "}
                    {patient.name}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
                    placeholder="Message"
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => {
                    sendSMSNotification(patient.$id, "Hello");
                  }}
                >
                  Send Message
                </Button>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={() => setModalAction("admit")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Admit
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admit Patient</DialogTitle>
                </DialogHeader>
                {getModalContent()}
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={() => setModalAction("discharge")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Discharge
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Discharge Patient</DialogTitle>
                </DialogHeader>
                {getModalContent()}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <p>Loading patient details...</p>
      )}
    </div>
  );
};

export default PatientDetailsPage;
