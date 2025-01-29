import React from "react";
import { BedSingle } from "lucide-react"; // Bed icon from lucide-react

const RoomBooking = ({ rooms, onRoomSelect }) => {
  // Group rooms by room type
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.room_type]) acc[room.room_type] = [];
    acc[room.room_type].push(room);
    return acc;
  }, {});

  // Handle room click
  const handleRoomClick = (room) => {
    onRoomSelect(room); // Pass the selected room to the parent
  };

  return (
    <div className="p-4 bg-gray-50 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Rooms Availability
      </h1>

      {Object.keys(groupedRooms).map((roomType) => (
        <div key={roomType} className="mb-6">
          <h2 className="text-base font-medium mb-2 text-gray-700">
            {roomType}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedRooms[roomType].map((room) => (
              <div
                key={room.$id}
                className={`flex flex-col items-center justify-center p-1 border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 ease-in-out
                    ${
                      room.is_available
                        ? "border-green-500 cursor-pointer"
                        : "border-gray-300 cursor-not-allowed"
                    }
                  `}
                onClick={() => handleRoomClick(room)} // Attach click handler
              >
                <BedSingle
                  size={20} // Reduced icon size
                  className={`${
                    room.is_available ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <p className="mt-1 text-sm font-medium text-gray-700">
                  {room.room_number}
                </p>
                {/* <p
                  className={`mt-1 text-xs ${
                    room.is_available ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {room.is_available ? "Available" : "Occupied"}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomBooking;
