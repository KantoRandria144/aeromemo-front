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
          setOriginalReunion({ ...reunionData });

          const savedQrCodeData = localStorage.getItem(`qrCodeData_${id}`);
          if (savedQrCodeData) {
            const { qrCodeUrl, reunionHash } = JSON.parse(savedQrCodeData);
            setQrCodeUrl(qrCodeUrl);
            setQrCodeGenerated(true);

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

  const handleDownloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qrcode_${reunion?.titre || reunion?.id || "reunion"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
      });

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    if (!reunion?.id) return;
    setTranscriptionLoading(true);

    try {
      const formData = new FormData();
      formData.append("AudioFile", audioBlob, "recording.webm");
      formData.append("ReunionId", reunion.id);

      const response = await fetch(`${endPoint}/api/CompteRendu/process-audio`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("Transcription terminée avec succès!");
      } else {
        alert("Erreur lors de la transcription audio");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'audio:", error);
      alert("Erreur lors de l'envoi de l'audio au serveur");
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
      <div className="p-6 md:p-10">
        <h2 className="text-lg font-semibold">Réunion</h2>
        <p className="text-sm text-gray-500 mb-6">Détails</p>

        <div className="h-full min-h-screen bg-white rounded-2xl shadow-md p-6">
          {/* Section en-tête */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            {/* Infos générales */}
            <div className="bg-gray-50 rounded-lg p-6 flex-1 shadow-sm">
              <h3 className="text-left font-bold text-zinc-600 text-xl md:text-2xl mb-6">
                Informations Générales
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="font-medium">
                    Titre: <span className="font-normal">{reunion.titre}</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {reunion.etat}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <p>
                  Date début: {reunion.dateDebut ? formatDate(reunion.dateDebut) : ""} à{" "}
                  {reunion.heureDebut ? formatTime(reunion.heureDebut) : ""} -{" "}
                  {reunion.dateFin ? formatTime(reunion.heureFin) : ""}
                </p>
              </div>
              <p className="mb-4">Emplacement: {reunion.emplacement}</p>

              {reunion.teamsMeetingLink && (
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 mb-4">
                  <p className="p-2">
                    Lien de la réunion:{" "}
                    <a href={reunion.teamsMeetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
                      Rejoindre
                    </a>
                  </p>
                </div>
              )}
              {reunion.teamsMeetingId && <p className="mb-2">ID de la réunion: {reunion.teamsMeetingId}</p>}
              {reunion.teamsSecretCode && <p>Code secret: {reunion.teamsSecretCode}</p>}
               {reunion.teamsMeetingLink && (
              <button
                onClick={() => window.open(reunion.teamsMeetingLink, "_blank")}
                className="px-5 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                Rejoindre Teams
              </button>
            )}
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center justify-start shadow-sm">
              <h3 className="text-center font-bold text-zinc-600 text-xl mb-6">QR Code</h3>
              {qrCodeGenerated && qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56 mb-6 border border-gray-300 rounded-lg shadow" />
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={handleDownloadQRCode}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 w-full"
                    >
                      <Download size={18} /> Télécharger
                    </button>
                    {reunionModified && (
                      <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-sm">
                        Les informations de la réunion ont été modifiées. Régénérez le QR Code pour refléter ces changements.
                      </div>
                    )}
                    <button
                      onClick={handleGenerateQRCode}
                      disabled={!reunionModified}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      <RefreshCw size={18} /> Régénérer QR Code
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateQRCode}
                  disabled={qrCodeLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 mt-10"
                >
                  {qrCodeLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <QrCode size={18} /> Générer QR Code
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-6 justify-center">
            {/* {reunion.outlookUrl && (
              <button
                onClick={() => window.open(reunion.outlookUrl, "_blank")}
                className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Ouvrir dans Outlook
              </button>
            )} */}

           
          </div>
          {/* Liste des participants */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Liste des participants</h3>
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
                  <tr key={idx}>
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

          {/* Boutons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowQRModal(true)}
              disabled={!qrCodeGenerated}
              className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <QrCode size={18} /> Voir QR Code
            </button>

            <button
              onClick={handleToggleTranscription}
              disabled={transcriptionLoading}
              className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors ${
                transcriptionActive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
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
                  <Mic size={18} /> Activer transcription audio
                </>
              )}
            </button>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
              Générer CR
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DetailsReunion;
