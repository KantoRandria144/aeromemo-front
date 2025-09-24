import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { scanQRCodeForParticipants, updateParticipantPresence } from "../../services/Reunion/QRCodeService";
import { Check, X, ArrowLeft, Loader } from "lucide-react";

const PresencePage = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [data, setData] = useState<{
    reunionId: string;
    reunionTitre: string;
    participants: {
      id: string;
      name: string;
      email: string;
      type: string;
      state: string;
    }[];
  } | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!qrCodeId) return;
      
      try {
        const response = await scanQRCodeForParticipants(qrCodeId);
        setData({
          reunionId: response.reunionId,
          reunionTitre: response.reunionTitre,
          participants: response.participants
        });
      } catch (error) {
        console.error("Erreur lors du chargement des participants:", error);
        alert("Erreur lors du scan du QR code");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [qrCodeId, navigate]);

  const handleUpdatePresence = async (participantId: string, state: string) => {
    if (!qrCodeId) return;
    
    setUpdating(participantId);
    try {
      await updateParticipantPresence(qrCodeId, participantId, state);
      
      // Mettre à jour l'état local
      setData(prev => prev ? {
        ...prev,
        participants: prev.participants.map(p => 
          p.id === participantId ? { ...p, state } : p
        )
      } : null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la présence");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-green-600" />
        </div>
      </DefaultLayout>
    );
  }

  if (!data) {
    return (
      <DefaultLayout>
        <div className="text-center p-6">Aucune donnée trouvée</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6 md:p-10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Gestion des présences</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{data.reunionTitre}</h2>
          <p className="text-gray-600">QR Code ID: {qrCodeId}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Liste des participants</h3>
            <p className="text-green-100 text-sm">Cliquez sur les boutons pour marquer la présence</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {data.participants.map((participant) => (
              <div key={participant.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-600">{participant.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{participant.type}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    participant.state === "Présent" 
                      ? "bg-green-100 text-green-800" 
                      : participant.state === "Absent"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {participant.state || "Non défini"}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdatePresence(participant.id, "Présent")}
                      disabled={updating === participant.id}
                      className={`p-2 rounded-full ${
                        participant.state === "Présent" 
                          ? "bg-green-600 text-white" 
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {updating === participant.id ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleUpdatePresence(participant.id, "Absent")}
                      disabled={updating === participant.id}
                      className={`p-2 rounded-full ${
                        participant.state === "Absent" 
                          ? "bg-red-600 text-white" 
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      } disabled:opacity-50`}
                    >
                      {updating === participant.id ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {data.participants.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              Aucun participant trouvé pour cette réunion
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PresencePage;