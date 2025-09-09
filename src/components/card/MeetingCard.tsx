import { Calendar } from "lucide-react";

type Meeting = {
  dateDebut: string;
  dateFin: string;
  emplacement: string;
  title?: string;
};

type MeetingCardProps = {
  title?: string;
  meetings?: Meeting[];
};

const MeetingCard = ({
  title = "Réunion de la journée",
  meetings = [],
}: MeetingCardProps) => {
  return (
    <div className="bg-pink-100 dark:bg-gray-900 rounded-lg p-6 shadow-lg">
      {/* Header avec icône */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-pink-800 dark:text-pink-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
      </div>

      {/* Liste scrollable si trop de réunions */}
      <div className="space-y-3 max-h-64 md:max-h-96 overflow-y-auto pr-2">
        {meetings.length > 0 ? (
          meetings.map((meeting, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {meeting.dateDebut} - {meeting.dateFin}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                📍 {meeting.emplacement}
              </div>
              {meeting.title && (
                <div className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                  {meeting.title}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            Aucune réunion prévue
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
