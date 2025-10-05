import { Calendar } from "lucide-react";
import { Reunion, EtatReunion } from "../../types/reunion";
import { useEffect, useState } from "react";
import { getMyReunions } from "../../services/Reunion/ReunionServices";
import { format, isToday, parseISO } from 'date-fns';

interface MeetingCardProps {
  filters?: {
    typeReunion?: number;
    collaborateur?: string;
    dateDebutMin?: string;
    dateDebutMax?: string;
  };
}



const MeetingCard: React.FC<MeetingCardProps> = ({ filters }) => {
  const [reunions, setReunions] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("userId");
    if (userData) {
      try {
        const parsedUserId = JSON.parse(userData);
        setUserId(parsedUserId.id || parsedUserId.userId || parsedUserId);
      } catch (e) {
        console.error("Erreur lors du parsing de userId:", e);
        // Si ce n'est pas un JSON, utiliser directement la valeur
        setUserId(userData);
      }
    } else {
      // Fallback: chercher dans d'autres emplacements possibles
      const token = localStorage.getItem("_au_pr");
      if (token) {
        // Essayer d'extraire l'ID utilisateur du token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserId(payload.userId || payload.sub || '');
        } catch (e) {
          console.error("Erreur lors du décodage du token:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchReunions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
          const toutesReunions = await getMyReunions(userId, {
          typeReunion: filters?.typeReunion,
          collaborateur: filters?.collaborateur,
          dateDebutMin: filters?.dateDebutMin ?? today,
          dateDebutMax: filters?.dateDebutMax ?? today,
        });

        setReunions(toutesReunions);
      } catch (err) {
        console.error("Erreur lors de la récupération des réunions:", err);
        setError("Erreur lors du chargement des réunions.");
      } finally {
        setLoading(false);
      }
    };

    fetchReunions();
  }, [userId, filters]);
  const formatHeure = (heure: string) => {
    try {
      const [heures, minutes] = heure.split(':');
      return `${heures}h${minutes}`;
    } catch {
      return heure;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-pink-100 dark:bg-gray-900 rounded-lg p-6 shadow-lg">
      {/* Header avec icône */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-pink-800 dark:text-pink-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Mes réunions aujourd'hui
        </h3>
      </div>

      {/* Liste scrollable si trop de réunions */}
      <div className="space-y-3 max-h-64 md:max-h-96 overflow-y-auto pr-2">
        {reunions.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            Aucune réunion prévue aujourd'hui
          </div>
        ) : (
          reunions.map((reunion, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {reunion.titre}
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
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                🕒 {formatHeure(reunion.heureDebut)} - {formatHeure(reunion.heureFin)} |  📍 {reunion.emplacement || "Lieu non spécifié"}
              </div>
              {/* Badge d'état */}
              {/* <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  reunion.etat === EtatReunion.Planifie ? 'bg-yellow-100 text-yellow-800' :
                  reunion.etat === EtatReunion.EnCours ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {reunion.etat === EtatReunion.Planifie ? 'Planifié' : 
                   reunion.etat === EtatReunion.EnCours ? 'En Cours' : 'Annulée'}
                </span>
              </div> */}
              
              {/* Boutons d'action */}
              <div className="flex gap-2 mt-3">
                {reunion.teamsMeetingLink && (
                  <a 
                    href={reunion.teamsMeetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Teams
                  </a>
                )}
                
                {reunion.outlookEventId && (
                  <a 
                    href={reunion.outlookEventId} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Outlook
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingCard;