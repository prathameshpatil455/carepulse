import React from "react";
import { BedSingle } from "lucide-react"; // Bed icon from lucide-react

const RoomBooking = ({ rooms }) => {
  // Group rooms by room type
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.room_type]) acc[room.room_type] = [];
    acc[room.room_type].push(room);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Room Booking System
      </h1>

      {Object.keys(groupedRooms).map((roomType) => (
        <div key={roomType} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {roomType}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedRooms[roomType].map((room) => (
              <div
                key={room.$id}
                className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <BedSingle
                  size={48}
                  className={`${
                    room.is_available ? "text-green-500" : "text-gray-500"
                  }`}
                />
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {room.room_number}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    room.is_available ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {room.is_available ? "Available" : "Occupied"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomBooking;
