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

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings }) => {
    return (
        <div className="bg-purple-100 dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Mes réunions du mois
            </h3>
            <div className="space-y-3">
                {meetings.map((meeting, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {meeting.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {meeting.dateDebut} - {meeting.heureDebut} à {meeting.heureFin}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs rounded font-medium
                                ${
                                    meeting.role === "Organisateur"
                                        ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                                        : "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                                }`}
                            >
                                {meeting.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingsList;
