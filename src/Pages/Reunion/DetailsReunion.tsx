import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getReunionById } from "../../services/Reunion/ReunionServices";
import { Reunion, ParticipantDTO } from "../../types/reunion";
import { formatDate, formatTime } from "../../services/Function/DateServices";
import { generateQRCode, getQRCodeInfo, scanQRCode } from "../../services/Reunion/QRCodeService";
import { Mic, MicOff, QrCode, Square, Download, RefreshCw } from "lucide-react";
const endPoint = import.meta.env.VITE_API_ENDPOINT;

// Fonction pour générer un hash des données de la réunion
const generateReunionHash = (reunion: Reunion): string => {
  const dataToHash = {
    titre: reunion.titre,
    description: reunion.description,
    dateDebut: reunion.dateDebut,
    dateFin: reunion.dateFin,
    heureDebut: reunion.heureDebut,
    heureFin: reunion.heureFin,
    emplacement: reunion.emplacement,
    teamsMeetingLink: reunion.teamsMeetingLink,
    teamsMeetingId: reunion.teamsMeetingId,
    teamsSecretCode: reunion.teamsSecretCode
  };
  
  // Simple hash function - vous pouvez utiliser une librairie comme crypto-js pour un hash plus robuste
  return btoa(encodeURIComponent(JSON.stringify(dataToHash)));
};

const DetailsReunion = () => {
  const { id } = useParams<{ id: string }>();
  const [reunion, setReunion] = useState<Reunion | null>(null);
  const [originalReunion, setOriginalReunion] = useState<Reunion | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [reunionModified, setReunionModified] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [transcriptionActive, setTranscriptionActive] = useState(false);
  
  useEffect(() => {
    const fetchReunion = async () => {
      try {
        if (id) {
          const data = await getReunionById(id);
          const reunionData = Array.isArray(data) ? data[0] : data;
          setReunion(reunionData);
          setOriginalReunion({...reunionData}); // Sauvegarde de la version originale
          
          // Vérifier si un QR code a déjà été généré pour cette réunion
          const savedQrCodeData = localStorage.getItem(`qrCodeData_${id}`);
          
          if (savedQrCodeData) {
            const { qrCodeUrl, reunionHash } = JSON.parse(savedQrCodeData);
            setQrCodeUrl(qrCodeUrl);
            setQrCodeGenerated(true);
            
            // Vérifier si la réunion a été modifiée depuis la génération du QR Code
            const currentHash = generateReunionHash(reunionData);
            if (reunionHash !== currentHash) {
              setReunionModified(true);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la réunion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReunion();
  }, [id]);

  // Surveiller les modifications de la réunion
  useEffect(() => {
    if (reunion && originalReunion) {
      const currentHash = generateReunionHash(reunion);
      const originalHash = generateReunionHash(originalReunion);
      
      setReunionModified(currentHash !== originalHash);
    }
  }, [reunion, originalReunion]);

  const handleGenerateQRCode = async () => {
    if (!reunion?.id) return;
    
    setQrCodeLoading(true);
    try {
      const qrCodeData = {
        reunionid: reunion.id,
        titre: reunion.titre,
        decription: reunion.description,
        datedebut: reunion.dateDebut,
        dayefin: reunion.dateFin,
        emplacement: reunion.emplacement,
        tokens: "10",
        etat: "active"
      };

      const qrCodeBlob = await generateQRCode(qrCodeData);
      const url = URL.createObjectURL(qrCodeBlob);
      setQrCodeUrl(url);
      setQrCodeGenerated(true);
      setReunionModified(false);
      
      // Sauvegarder les données du QR code avec le hash de la réunion
      const reunionHash = generateReunionHash(reunion);
      localStorage.setItem(`qrCodeData_${reunion.id}`, JSON.stringify({
        qrCodeUrl: url,
        reunionHash: reunionHash
      }));
      
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      alert("Erreur lors de la génération du QR code");
    } finally {
      setQrCodeLoading(false);
    }
  };

  const handleScanQRCode = async () => {
    const qrCodeId = prompt("Entrez l'ID du QR Code scanné :");
    const email = prompt("Entrez votre email :");
    if (qrCodeId && email) {
      try {
        const res = await scanQRCode(qrCodeId, email);
        alert(`✅ Présence enregistrée pour ${res.participant}`);
      } catch (err: any) {
        alert("Erreur: " + err.message);
      }
    }
  };

  const handleGetQRCodeInfo = async () => {
    const qrCodeId = prompt("Entrez l'ID du QR Code :");
    if (qrCodeId) {
      try {
        const info = await getQRCodeInfo(qrCodeId);
        alert(
          `📌 Réunion : ${info.reunion.titre}\n📍 Lieu : ${info.reunion.emplacement}\n📅 Date : ${info.reunion.dateDebut}`
        );
      } catch (err: any) {
        alert("Erreur: " + err.message);
      }
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode_${reunion?.titre || reunion?.id || 'reunion'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 ) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, {type: 'audio/webm'});
        await sendAudioToBackend(audioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    if (!reunion?.id) return;

    setTranscriptionLoading(true);

    try {
      const formData = new FormData();
      formData.append('AudioFile', audioBlob, 'recording.webm');
      formData.append('ReunionId', reunion.id);

      const response = await fetch(`${endPoint}/api/CompteRendu/process-audio`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Transcription réussie:', result);
        alert('Transcription terminée avec succès!');
      } else {
        const errorText = await response.text();
        console.error('Erreur lors de la transcription:', errorText);
        alert('Erreur lors de la transcription audio');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'audio:', error);
      alert('Erreur lors de l\'envoi de l\'audio au serveur');
    } finally {
      setTranscriptionLoading(false);
    }
  };

  const handleToggleTranscription = () => {
    if (!transcriptionActive) {
      setTranscriptionActive(true);
      startRecording();
    } else {
      setTranscriptionActive(false);
      stopRecording();
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!reunion) return <p>Aucune donnée trouvée</p>;

  return (
    <DefaultLayout>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Réunion</h2>
        <p className="text-sm text-gray-500 mb-4">Details</p>
        <div className="h-full min-h-screen bg-white rounded-2xl shadow-md p-6 dark:border-strokedark dark:bg-boxdark">
          {/* Section en-tête avec informations et QR Code */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Informations générales */}
            <div className="bg-gray-50 rounded-lg p-6 flex-1">
              <h3 className="text-center font-bold text-zinc-400 text-xl md:text-2xl mb-4">
                Information Générale
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="font-medium">
                    Titre: <span className="font-normal">{reunion.titre}</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {reunion.etat}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <p>
                  Date début:
                  {reunion.dateDebut ? formatDate(reunion?.dateDebut) : ""}
                </p>
                <p>
                  Date fin:
                  {reunion?.dateFin ? formatDate(reunion?.dateFin) : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <p>
                  Heure début:
                  {reunion.heureDebut ? formatTime(reunion.heureDebut) : ""}
                </p>
                <p>
                  Heure fin:
                  {reunion.dateFin ? formatTime(reunion.heureFin) : ""}
                </p>
              </div>
              <p>Emplacement: {reunion.emplacement}</p>

              {reunion.teamsMeetingLink && (
                <p>
                  Lien de la réunion:{" "}
                  <a
                    href={reunion.teamsMeetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline ml-2"
                  >
                    Rejoindre
                  </a>
                </p>
              )}

              {reunion.teamsMeetingId && (
                <p>ID de la réunion: {reunion.teamsMeetingId}</p>
              )}

              {reunion.teamsSecretCode && (
                <p>Code secret: {reunion.teamsSecretCode}</p>
              )}
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-50 rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center justify-center">
              <h3 className="text-center font-bold text-zinc-400 text-xl mb-4">
                QR Code
              </h3>
              
              {qrCodeGenerated && qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-48 h-48 mb-4 border border-gray-300 rounded-lg"
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={handleDownloadQRCode}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 w-full"
                    >
                      <Download size={18} />
                      Télécharger
                    </button>
                    
                    {reunionModified && (
                      <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-sm">
                        Les informations de la réunion ont été modifiées. Régénérez le QR Code pour refléter ces changements.
                      </div>
                    )}
                    
                    <button
                      onClick={handleGenerateQRCode}
                      disabled={!reunionModified}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2"
                    >
                      <RefreshCw size={18} />
                      Régénérer QR Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500 mb-4 text-center">
                    Aucun QR Code généré pour cette réunion
                  </p>
                  <button
                    onClick={handleGenerateQRCode}
                    disabled={qrCodeLoading}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                  >
                    {qrCodeLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <QrCode size={18} />
                        Générer QR Code
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liste des participants */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Liste des participants</h3>
            </div>

            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reunion.participants?.map((participant: ParticipantDTO, idx: number) => (
                  <tr key={idx} className="">
                    <td className="px-4 py-2">{participant.userName}</td>
                    <td className="px-4 py-2">{participant.userEmail}</td>
                    <td className="px-4 py-2">{participant.type}</td>
                    <td className="px-4 py-2">{participant.state}</td>
                  </tr>
                ))}
                
                {(!reunion.participants || reunion.participants.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      Aucun participant
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        
          {/* Boutons d'action */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowQRModal(true)}
              disabled={!qrCodeGenerated}
              className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <QrCode size={18} />Voir QR Code
            </button>
            
            <button 
              onClick={handleToggleTranscription}
              disabled={transcriptionLoading}
              className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors ${
                transcriptionActive 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
              } disabled:opacity-50`}
            >
              {transcriptionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Traitement...
                </>
              ) : transcriptionActive ? (
                <>
                  {isRecording ? <MicOff size={18} /> : <Square size={18} />}
                  Arrêter transcription
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Activer transcription audio
                </>
              )}
            </button>
            
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
              Générer CR
            </button>
          </div>
        </div>
      </div>
      
      {showQRModal && qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">QR Code Généré</h3>
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-64 h-64 mx-auto mb-4"
            />
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDownloadQRCode}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Download size={18} />
                Télécharger
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default DetailsReunion;