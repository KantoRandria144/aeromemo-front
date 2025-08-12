import { Calendar } from 'lucide-react';
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
const MeetingCard = ({ title = "Réunion de la journée", meetings = [] }: MeetingCardProps) => {
    return(
        <>
        <div className="bg-pink-200 border border-pink-300 rounded-lg p-4 w-100 shadow-sm">
            {/* icone start*/}
            <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-pink-900"/>
                <h3 className='text-sm font-medium text-pink-900'>{title}</h3>
            </div>
            {/* icone end */}
            {/* liste start*/}
            <div className='space-y-2'>
                {meetings.map((meeting, index) => (
                    <div  key={index} className='text-xs text-pink-900'>
                        <div className='font-medium'>
                            {meeting.dateDebut} - {meeting.dateFin} | {meeting.emplacement}
                        </div>
                        {meeting.title && (
                            <div className='text-pink-700 mt-1'>
                                {meeting.title}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* liste end */}
        </div>
        </>
    );
};

export default MeetingCard;