import React, { useEffect, useState } from "react";
import { Reunion } from "../../types/reunion";
import { getMyReunions } from "../../services/Reunion/ReunionServices";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";

const MeetingsList: React.FC = () => {
   const [reunions, setReunions] = useState<Reunion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const userData = localStorage.getItem('userId');
        if (userData) {
            setUserId(userData);
        } else {
            // Fallback si l'userId est stocké différemment
            const user = localStorage.getItem('user');
            if (user) {
                const userObj = JSON.parse(user);
                setUserId(userObj.id || userObj.userId);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchReunions();
        }
    }, [userId, selectedMonth]);

    const fetchReunions = async () => {
        try {
            setLoading(true);
            const userReunions = await getMyReunions(userId);

            // Calcul des dates de début et fin du mois sélectionné
            const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
            const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

            const filteredReunions = userReunions.filter(reunion => {
                const reunionDate = new Date(reunion.dateDebut);
                return reunionDate >= monthStart && reunionDate <= monthEnd;
            });

            const sortedReunions = filteredReunions.sort((a, b) => {
                const dateA = new Date(`${a.dateDebut}T${a.heureDebut}`);
                const dateB = new Date(`${b.dateDebut}T${b.heureDebut}`);

                return dateA.getTime() - dateB.getTime();
            });

            setReunions(sortedReunions);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des réunions');
            setLoading(false);
            console.error(err);
        }
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedMonth);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setSelectedMonth(newDate);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5);
    };

    const getMonthName = (date: Date) => {
        const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Information copiée dans le presse-papier');
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };

    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    }

    const isPast = (dateString: string, timeString: string) => {
        const now = new Date();
        const meetingDateTime = new Date(`${dateString}T${timeString}`);
        return meetingDateTime < now;
    };


    if (loading) return <div className="text-lg h-64 flex items-center justify-center">Chargement...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Erreur: {error}</div>;
    return (
        <div className="bg-purple-100 dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Mes réunions du mois de {getMonthName(selectedMonth)}
            </h3>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => changeMonth('prev')}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                    {getMonthName(selectedMonth)}
                </span>
                <button 
                    onClick={() => changeMonth('next')}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            
            {/* Conteneur scrollable si trop de réunions */}
            <div className="space-y-3 max-h-64 md:max-h-96 overflow-y-auto pr-2">
                {reunions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center text-gray-600 dark:text-gray-400">
                        Aucune réunion prévue ce mois-ci
                    </div>
                ) : (
                    reunions.map((reunion, index) => {
                        const isTodayMeeting = isToday(reunion.dateDebut);
                        const isPastMeeting = isPast(reunion.dateDebut, reunion.heureDebut);
                        return (
                            <div 
                                key={index}
                                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 ${
                                    isTodayMeeting 
                                        ? "border-blue-500" 
                                        : isPastMeeting 
                                            ? "border-gray-400" 
                                            : "border-green-500"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {reunion.titre}
                                        {isTodayMeeting && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Aujourd'hui
                                            </span>
                                        )}
                                    </div>
                                    <span 
                                        className={`px-2 py-1 text-xs rounded font-medium
                                        ${
                                            reunion.etat === "Planifié" 
                                                ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100" :
                                            reunion.etat === "EnCours" 
                                                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100" :
                                            reunion.etat === "Terminé" 
                                                ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100" :
                                            reunion.etat === "Annulé" 
                                                ? "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100" :
                                                "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                                        }`}
                                    >
                                        {reunion.etat}
                                    </span>
                                </div> 
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <div className="flex items-center mb-1">
                                        <Calendar size={14} className="mr-2" />
                                        {formatDate(reunion.dateDebut)}
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <Clock size={14} className="mr-2" />
                                        {formatTime(reunion.heureDebut)} - {formatTime(reunion.heureFin)}
                                    </div>
                                    {reunion.emplacement && (
                                        <div className="flex items-center mb-1">
                                            <MapPin size={14} className="mr-2" />
                                            {reunion.emplacement}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MeetingsList;
