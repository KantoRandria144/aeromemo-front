import React from "react";

interface Meeting {
    title: string;
    dateDebut: string;
    heureDebut: string;
    heureFin: string;
    role: "Organisateur" | "Participant";
}

interface MeetingsListProps {
    meetings: Meeting[];
}
const MeetingsList: React.FC<MeetingsListProps> = ({meetings}) => {
    return (
        <>
        <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg feont-semibold text-gray-800 mb-4">Mes réunions du mois</h3>
            <div className="space-y-3">
                {meetings.map((meeting, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-sm">
                                    {meeting.title}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {meeting.dateDebut} - {meeting.heureDebut} à {meeting.heureFin}
                                </div>
                            </div>
                            <span 
                                className={`px-2 py-1 text-xs rounded ${
                                meeting.role === "Organisateur"
                                ? "bg-green-200 text-green-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}>
                            {meeting.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default MeetingsList;