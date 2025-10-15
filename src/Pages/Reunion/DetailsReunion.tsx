import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getReunionById, buildOutlookUrl, buildTeamsUrl } from "../../services/Reunion/ReunionServices";
import { Reunion, ParticipantDTO } from "../../types/reunion";
import { formatDate, formatTime } from "../../services/Function/DateServices";
import { Mic, MicOff, QrCode, Square, Download, RefreshCw } from "lucide-react";
import { generateCheckInUrl } from "../../services/Reunion/QRCodeService";
import QRCode from "qrcode";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

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
    teamsSecretCode: reunion.teamsSecretCode,
  };
  return btoa(encodeURIComponent(JSON.stringify(dataToHash)));
};

const DetailsReunion = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reunion, setReunion] = useState<Reunion | null>(null);
  const [originalReunion, setOriginalReunion] = useState<Reunion | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [reunionModified, setReunionModified] = useState(false);
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [transcriptionActive, setTranscriptionActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
            setReunionModified(reunionHash !== currentHash);
          }

          setQrCodeLoaded(true);
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
      const userId = localStorage.getItem("userId") || "demo-user";
      const apiUrl = generateCheckInUrl(userId, reunion.id);

      console.log("URL du QR Code:", apiUrl);

      const qrCodeDataUrl = await QRCode.toDataURL(apiUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });

      setQrCodeUrl(qrCodeDataUrl);
      setQrCodeGenerated(true);
    } catch (error) {
      console.error("Erreur QR:", error);
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
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
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
        body: formData,
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

  // 🔁 Vérifie toutes les 5 secondes si un participant a scanné le QR code
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const data = await getReunionById(id);
        const reunionData = Array.isArray(data) ? data[0] : data;

        const hasNewCheckIn =
          JSON.stringify(reunion?.participants) !== JSON.stringify(reunionData.participants);

        if (hasNewCheckIn) {
          setReunion(reunionData);
          setShowModal(true);

          setTimeout(() => {
            setShowModal(false);
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du check-in :", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, reunion]);

  if (loading) return <p>Chargement...</p>;
  if (!reunion) return <p>Aucune donnée trouvée</p>;

  return (
    <DefaultLayout>
      <div className="p-6 md:p-10">
        <Breadcrumb
          paths={[
            { name: "Réunion", to: "/aeromemo/planification" },
            { name: "Créer Réunion" },
          ]}
        />
          
          {/* ✅ Bouton Actions à droite */}
        <div className="flex justify-end mb-4">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowActions((prev) => !prev)}
              className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 focus:outline-none flex items-center gap-2"
            >
              ⚙️ Actions
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 dark:bg-boxdark dark:border-form-strokedark">
                <button
                  onClick={() => navigate(`/aeromemo/reunion/modification/${reunion?.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  ✏️ Modifier
                </button>

                <button
                  onClick={() => {
                    if (reunion) {
                      const outlookUrl = buildOutlookUrl(reunion);
                      window.open(outlookUrl, "_blank");
                    }
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  📅 Ouvrir dans Outlook
                </button>

                <button
                  onClick={() => {
                    if (reunion) {
                      const teamsUrl = buildTeamsUrl(reunion);
                      window.open(teamsUrl, "_blank");
                    }
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  💬 Rejoindre sur Teams
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-full min-h-screen bg-white rounded-2xl shadow-md p-6">
          {/* Informations principales */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            <div className="bg-gray-50 rounded-lg p-6 flex-1 shadow-sm">
              <h3 className="text-left font-bold text-zinc-600 text-xl md:text-2xl mb-6">
                Informations Générales
              </h3>
              <p className="mb-3 font-medium">
                Titre: <span className="font-normal">{reunion.titre}</span>
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  {reunion.etat}
                </span>
              </p>
              <p className="mb-3">
                Date début: {formatDate(reunion.dateDebut)} à{" "}
                {formatTime(reunion.heureDebut)} - {formatTime(reunion.heureFin)}
              </p>
              <p className="mb-3">Emplacement: {reunion.emplacement}</p>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center justify-start shadow-sm">
              <h3 className="text-center font-bold text-zinc-600 text-xl mb-6">QR Code</h3>

              {qrCodeGenerated && qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-56 h-56 mb-6 border border-gray-300 rounded-lg shadow"
                  />
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={handleDownloadQRCode}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 w-full"
                    >
                      <Download size={18} /> Télécharger
                    </button>
                    <button
                      onClick={handleGenerateQRCode}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 w-full"
                    >
                      <RefreshCw size={18} /> Régénérer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateQRCode}
                  disabled={qrCodeLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 mt-10"
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

          {/* Liste des participants */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Liste des participants</h3>
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Présence</th>
                </tr>
              </thead>
              <tbody>
                {reunion.participants?.map((p: ParticipantDTO, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{p.userName}</td>
                    <td className="px-4 py-2">{p.userEmail}</td>
                    <td className="px-4 py-2">{p.type}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        p.checkIn?.toLowerCase().trim() === "present"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {p.checkIn?.toLowerCase().trim() === "present"
                        ? "Présent"
                        : "Absent"}
                    </td>
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

            {/* Boutons transcription & CR */}
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
      </div>

      {/* ✅ Modal confirmation scan */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center animate-fade-in">
            <h3 className="text-green-600 font-semibold text-lg mb-2">
              ✅ Scan réussi !
            </h3>
            <p className="text-gray-600">
              La liste des participants va se mettre à jour...
            </p>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default DetailsReunion;
