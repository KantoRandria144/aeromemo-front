import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getReunionById, buildOutlookUrl, buildTeamsUrl } from "../../services/Reunion/ReunionServices";
import { Reunion, ParticipantDTO } from "../../types/reunion";
import { formatDate, formatTime } from "../../services/Function/DateServices";
import { Mic, MicOff, QrCode, Square, Download, RefreshCw } from "lucide-react";
import { generateCheckInUrl } from "../../services/Reunion/QRCodeService";
import QRCode from "qrcode";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import { uploadTranscriptionFile, TranscriptionApiResponse } from "../../services/TranscriptionService";
import { getTranscriptionByReunionId } from "../../services/TranscriptionService";
import { getAllUsers } from "../../services/User/UserServices";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { getThreeInitials } from "../../services/Function/UserFonctionService";
import axios from "axios";


type SimpleUser = { id: string; name: string; email: string };

const ParticipantsAutocomplete: React.FC<{
  label: string;
  selected: SimpleUser[];
  onChange: (next: SimpleUser[]) => void;
  excludeIds?: string[];
}> = ({ label, selected, onChange, excludeIds = [] }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SimpleUser[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) return setSuggestions([]);
      try {
        const data = await getAllUsers(query);
        let list: SimpleUser[] = Array.isArray(data) ? data : [];
        const v = query.toLowerCase();
        list = list.filter(
          (u) =>
            ((u.name || "").toLowerCase().includes(v) ||
              (u.email || "").toLowerCase().includes(v)) &&
            !selected.some((s) => s.id === u.id) &&
            !(excludeIds || []).includes(u.id)
        );
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, excludeIds, selected]);

  const addOne = (u: SimpleUser) => {
    if (!selected.some((p) => p.id === u.id)) onChange([...selected, u]);
    setQuery("");
    setOpen(false);
  };
  const removeOne = (id: string) => onChange(selected.filter((p) => p.id !== id));

  return (
    <div ref={boxRef}>
      <label className="block mb-1 font-semibold text-sm text-gray-700">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Rechercher un utilisateur…"
        className="w-full rounded border p-2 mb-2"
      />
      {open && suggestions.length > 0 && (
        <div className="bg-white border rounded shadow max-h-40 overflow-auto absolute z-10 w-full">
          {suggestions.map((u) => (
            <button
              key={u.id}
              onClick={() => addOne(u)}
              type="button"
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              <span className="font-semibold">{u.name}</span>
              <br />
              <span className="text-xs text-gray-500">{u.email}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((u) => (
          <div
            key={u.id}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
          >
            <div className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs mr-2">
              {getThreeInitials(u.name)}
            </div>
            <span className="text-sm mr-1">{u.name}</span>
            <button
              onClick={() => removeOne(u.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};



// ────────────────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────────────────
const endPoint = import.meta.env.VITE_API_ENDPOINT as string;

// ────────────────────────────────────────────────────────────────────────────────
// Utils
// ────────────────────────────────────────────────────────────────────────────────
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

// Pour affichage markdown-like simple (sans lib externe)
function asBullets(lines?: string[] | null): string {
  if (!lines || lines.length === 0) return "• Aucun";
  return lines.map((l) => `• ${l}`).join("\n");
}

function clip(s?: string, n: number = 800): string {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

// ────────────────────────────────────────────────────────────────────────────────
// Composant
// ────────────────────────────────────────────────────────────────────────────────
const DetailsReunion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── states réunion ────────────────────────────────────────────────────────────
  const [reunion, setReunion] = useState<Reunion | null>(null);
  const [originalReunion, setOriginalReunion] = useState<Reunion | null>(null);
  const [loading, setLoading] = useState(true);

  // ── QR code ───────────────────────────────────────────────────────────────────
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [reunionModified, setReunionModified] = useState(false);
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // ── menu actions ──────────────────────────────────────────────────────────────
  const [showActions, setShowActions] = useState(false);

  // ── enregistrement micro → backend maison (/api/CompteRendu/process-audio) ────
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [transcriptionActive, setTranscriptionActive] = useState(false);

  // ── modal transcription fichier → API C# ──────────────────────────────────────
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<TranscriptionApiResponse | null>(null);

  // ── vidéo démonstration ───────────────────────────────────────────────────────
  const [videoUrl, setVideoUrl] = useState<string>("/videos/reunion-demo.mp4");

  // 🔥 Compte rendu généré
const [transcriptionData, setTranscriptionData] = useState<any | null>(null);
const [loadingTranscription, setLoadingTranscription] = useState(false);
const [uploadProgress, setUploadProgress] = useState<number>(0);


const [showAddParticipantsModal, setShowAddParticipantsModal] = useState(false);
const [requiredParticipants, setRequiredParticipants] = useState<SimpleUser[]>([]);
const [optionalParticipants, setOptionalParticipants] = useState<SimpleUser[]>([]);
const notyf = useMemo(() => new Notyf({ position: { x: "center", y: "top" } }), []);


  // ──────────────────────────────────────────────────────────────────────────────
  // Fetch réunion
  // ──────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReunion = async () => {
      try {
        if (!id) return;

        const data = await getReunionById(id);
        const reunionData = Array.isArray(data) ? (data as Reunion[])[0] : (data as Reunion);
        setReunion(reunionData);
        setOriginalReunion({ ...reunionData });

        // Restore QR code from storage
        const saved = localStorage.getItem(`qrCodeData_${id}`);
        if (saved) {
          const { qrCodeUrl, reunionHash } = JSON.parse(saved);
          setQrCodeUrl(qrCodeUrl);
          setQrCodeGenerated(true);
          const currentHash = generateReunionHash(reunionData);
          setReunionModified(reunionHash !== currentHash);
        }

        setQrCodeLoaded(true);
        // 🔁 Charger la transcription générée automatiquement
        setLoadingTranscription(true);
        const dataTra = await getTranscriptionByReunionId(reunionData.id);
        if (dataTra && dataTra.length > 0) {
          setTranscriptionData(dataTra[0]);
        }

      } catch (e) {
        console.error("Erreur lors du chargement de la réunion:", e);
      } finally {
        setLoading(false);
        setLoadingTranscription(false);
      }
    };

    fetchReunion();
  }, [id]);

  // Détection de modification de la réunion (pour le bouton Refresh du QR)
  useEffect(() => {
    if (reunion && originalReunion) {
      const currentHash = generateReunionHash(reunion);
      const originalHash = generateReunionHash(originalReunion);
      setReunionModified(currentHash !== originalHash);
    }
  }, [reunion, originalReunion]);

  // ──────────────────────────────────────────────────────────────────────────────
  // QR Code
  // ──────────────────────────────────────────────────────────────────────────────
  const handleGenerateQRCode = async () => {
    if (!reunion?.id) return;
    setQrCodeLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "demo-user";
      const apiUrl = generateCheckInUrl(userId, reunion.id);

      const dataUrl = await QRCode.toDataURL(apiUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });

      const reunionHash = generateReunionHash(reunion);
      localStorage.setItem(
        `qrCodeData_${reunion.id}`,
        JSON.stringify({ qrCodeUrl: dataUrl, reunionHash })
      );

      setQrCodeUrl(dataUrl);
      setQrCodeGenerated(true);
    } catch (e) {
      console.error("Erreur QR:", e);
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

  // ──────────────────────────────────────────────────────────────────────────────
  // Enregistrement micro → backend maison (process-audio)
  // ──────────────────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        await sendAudioToBackend(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      setIsRecording(true);
    } catch (e) {
      console.error("Erreur accès micro:", e);
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
      const form = new FormData();
      form.append("AudioFile", audioBlob, "recording.webm");
      form.append("ReunionId", reunion.id);

      const res = await fetch(`${endPoint}/api/CompteRendu/process-audio`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(`Erreur transcription audio (${res.status})`);
      alert("Transcription terminée avec succès!");
    } catch (e) {
      console.error("Erreur envoi audio:", e);
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

  // ──────────────────────────────────────────────────────────────────────────────
  // Transcription fichier → API C# locale
  // ──────────────────────────────────────────────────────────────────────────────
 const handleUploadFile = async () => {
  if (!file) return alert("⚠️ Veuillez sélectionner un fichier à transcrire.");
  if (!reunion?.id) return alert("❌ Réunion introuvable.");

  setUploading(true);
  setTranscriptionResult(null);
  setUploadProgress(0);

  try {
    const data = await uploadTranscriptionFile(file, "fr", reunion.id, (progress) => {
      setUploadProgress(progress);
    });

    // 🔽 ton affichage résumé existant
    const { summary, text, pointsCles, actions, decisions, participants } = data;
    const formattedResult = `
📝 **Résumé :**
${summary || "Aucun résumé"}

🎯 **Points clés :**
${pointsCles?.length ? pointsCles.join(", ") : "Aucun"}

⚙️ **Actions :**
${actions?.length ? actions.join("\n") : "Aucune"}

👥 **Participants :**
${participants?.length ? participants.join(", ") : "Aucun"}

🗣️ **Texte :**
${text?.slice(0, 300)}${text?.length > 300 ? "..." : ""}
`;
    setTranscriptionResult(formattedResult);
  } catch (err) {
    console.error(err);
    alert("Erreur durant la transcription !");
  } finally {
    setUploading(false);
  }
};


  // ──────────────────────────────────────────────────────────────────────────────
  // Rendu
  // ──────────────────────────────────────────────────────────────────────────────
  if (loading) return <p>Chargement…</p>;
  if (!reunion) return <p>Aucune donnée trouvée</p>;

  return (
    <DefaultLayout>
      <div className="p-6 md:p-10">
        <Breadcrumb
          paths={[
            { name: "Réunion", to: "/aeromemo/planification" },
            { name: "Détails Réunion" },
          ]}
        />

        {/* Actions (menu) */}
        <div className="flex justify-end mb-4">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowActions((prev) => !prev)}
              className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 focus:outline-none flex items-center gap-2"
            >
              Actions
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 dark:bg-boxdark dark:border-form-strokedark">
                <button
                  onClick={() => navigate(`/aeromemo/reunion/modification/${reunion?.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  Modifier
                </button>

                <button
                  onClick={() => {
                    if (!reunion) return;
                    const participantsObligatoires =
                      reunion.participants?.filter((p) => p.type?.toLowerCase() === "obligatoire").map((p) => p.userEmail) || [];
                    const participantsFacultatifs =
                      reunion.participants?.filter((p) => p.type?.toLowerCase() === "facultatif").map((p) => p.userEmail) || [];

                    const reunionForOutlook = {
                      ...reunion,
                      participantsObligatoires,
                      participantsFacultatifs,
                    };
                    const outlookUrl = buildOutlookUrl(reunionForOutlook);
                    window.open(outlookUrl, "_blank");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  Ouvrir dans Outlook
                </button>

                <button
                  onClick={() => {
                    if (!reunion) return;
                    const teamsUrl = buildTeamsUrl(reunion);
                    window.open(teamsUrl, "_blank");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  Rejoindre sur Teams
                </button>

                {/* Transcription (modal fichier → API C#) */}
                <button
                  onClick={() => setShowTranscriptionModal(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  🎙️ Transcription (fichier)
                </button>

                {/* Enregistrement micro → backend maison */}
                <button
                  onClick={handleToggleTranscription}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2 ${
                    transcriptionActive ? "text-red-600" : ""
                  }`}
                >
                  {transcriptionActive ? "⏹️ Arrêter enregistrement" : "🎤 Enregistrer (micro)"}
                </button>

                <button
                  onClick={() => alert("📝 Génération du Compte Rendu…")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-boxdark2"
                >
                  Générer Compte Rendu
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-full min-h-screen bg-white rounded-2xl shadow-md p-6">
          {/* ───────────────────────────────────────────────────────────────────────
              Informations générales
          ─────────────────────────────────────────────────────────────────────── */}
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
                Date début: {formatDate(reunion.dateDebut)} à {formatTime(reunion.heureDebut)} - {formatTime(reunion.heureFin)}
              </p>
              <p className="mb-3">Emplacement: {reunion.emplacement}</p>
            </div>

            {/* ───────────────────────────────────────────────────────────────────
                QR Code
            ─────────────────────────────────────────────────────────────────── */}
            <div className="bg-gray-50 rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center justify-start shadow-sm relative">
              <div className="flex items-center justify-center w-full mb-6 relative">
                <h3 className="text-center font-bold text-zinc-600 text-xl">QR Code</h3>
                {reunionModified && (
                  <button
                    title="Les informations ont changé — régénérez le QR Code"
                    onClick={handleGenerateQRCode}
                    className="absolute right-0 text-amber-600 hover:text-amber-700 transition-all"
                  >
                    <RefreshCw size={20} className="animate-spin-slow hover:rotate-180 transition-transform duration-500" />
                  </button>
                )}
              </div>

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
                  className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 mt-10 disabled:opacity-50"
                >
                  {qrCodeLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Génération…
                    </>
                  ) : (
                    <>
                      <QrCode size={18} /> Générer QR Code
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────────────────
                Vidéo démonstration
            ─────────────────────────────────────────────────────────────────── */}
            <div className="bg-gray-50 rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center justify-start shadow-sm">
             {transcriptionData?.fileName && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">🎧 Fichier audio associé</h4>
                  <audio
                    controls
                    src={`http://localhost:5000/uploads/${transcriptionData.fileName}`}
                    className="w-full"
                  >
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              )}
              <p className="mt-3 text-sm text-gray-500 italic text-center">Audio enregistrée apres la réunion</p>

              <button
                onClick={() => alert("Lecture de la vidéo complète")}
                className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium shadow hover:bg-green-700 transition-colors"
              >
                Générer CR
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────────
              Liste des participants
          ─────────────────────────────────────────────────────────────────────── */}
          <div className="mt-6">
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-semibold">Liste des participants</h3>
    <button
      onClick={() => setShowAddParticipantsModal(true)}
      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 text-sm"
    >
      ➕ Ajouter participants
    </button>
  </div>

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
                {reunion.participants?.map((p: ParticipantDTO, idx: number) => {
                  const isPresent = (p.checkIn || "").toLowerCase().trim() === "present";
                  return (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2">{p.userName}</td>
                      <td className="px-4 py-2">{p.userEmail}</td>
                      <td className="px-4 py-2">{p.type}</td>
                      <td className={`px-4 py-2 font-semibold ${isPresent ? "text-green-600" : "text-gray-500"}`}>
                        {isPresent ? "Présent" : "Absent"}
                      </td>
                    </tr>
                  );
                })}
                {(!reunion.participants || reunion.participants.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      Aucun participant
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* ───────────────────────────────────────────────────────────────────────────────
    Compte rendu généré automatiquement
─────────────────────────────────────────────────────────────────────────────── */}
<div className="mt-10 bg-gray-50 rounded-xl shadow-sm p-6">
  <h3 className="text-xl font-bold text-zinc-700 mb-4 flex items-center gap-2">
    📝 Compte rendu généré
  </h3>

  {loadingTranscription ? (
    <p className="text-gray-500">Chargement du compte rendu...</p>
  ) : transcriptionData ? (
    <div className="space-y-3 text-gray-800 text-sm leading-relaxed">
      <p>
        <span className="font-semibold text-green-700">Résumé :</span><br />
        {transcriptionData.summary || "—"}
      </p>

      <p>
        <span className="font-semibold text-green-700">Points clés :</span><br />
        {transcriptionData.pointsCles
          ? transcriptionData.pointsCles.split(";").map((p: string, i: number) => (
              <span key={i} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                {p}
              </span>
            ))
          : "—"}
      </p>

      <p>
        <span className="font-semibold text-green-700">Décisions :</span><br />
        {transcriptionData.decisions || "—"}
      </p>

      <p>
        <span className="font-semibold text-green-700">Actions :</span><br />
        <span className="whitespace-pre-wrap">{transcriptionData.actions || "—"}</span>
      </p>

      <p>
        <span className="font-semibold text-green-700">Objectifs :</span><br />
        <span className="whitespace-pre-wrap">{transcriptionData.objectives || "—"}</span>
      </p>

      <p>
        <span className="font-semibold text-green-700">Participants détectés :</span><br />
        {transcriptionData.participants || "—"}
      </p>

      <p className="text-xs text-gray-500 italic">
        Généré le : {new Date(transcriptionData.createdAt).toLocaleString()}
      </p>
    </div>
  ) : (
    <p className="text-gray-500 italic">Aucun compte rendu généré pour cette réunion.</p>
  )}
</div>

          </div>


          {/* ───────────────────────────────────────────────────────────────────────
              (Optionnel) Zone controles micro (si tu veux l’afficher hors menu)
          ─────────────────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleToggleTranscription}
              disabled={transcriptionLoading}
              className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors ${
                transcriptionActive ? "bg-red-600 text-white hover:bg-red-700" : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
              } disabled:opacity-50`}
            >
              {transcriptionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Traitement…
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
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────
          MODAL : Transcription fichier → API C#
      ─────────────────────────────────────────────────────────────────────────── */}
      {showTranscriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Transcrire un fichier — <span className="text-green-700">{reunion?.titre}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a,.mp4,.mov,.avi,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button
                onClick={handleUploadFile}
                disabled={uploading || !file}
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50"
              >
                {uploading ? "⏳ Envoi…" : "🎙️ Transcrire"}
              </button>
              {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-green-600 h-2.5 transition-all duration-200 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {uploading && (
              <p className="text-xs text-gray-500 mt-2 text-center">{uploadProgress}% envoyé...</p>
            )}

            </div>

            {transcriptionResult && (
              <div className="mt-4 bg-gray-50 border p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-[55vh] overflow-auto">
                {transcriptionResult}
              </div>
            )}

            <button
              onClick={() => {
                setShowTranscriptionModal(false);
                setFile(null);
                setTranscriptionResult(null);
                setApiResult(null);
                window.location.reload();
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────
          MODAL : QR Preview (si tu le veux – activable via setShowQRModal(true))
      ─────────────────────────────────────────────────────────────────────────── */}
      {showQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-lg mb-4">QR Code — {reunion?.titre}</h3>
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR" className="w-64 h-64 border rounded-lg" />
            ) : (
              <p className="text-gray-600">Aucun QR Code généré</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowQRModal(false)}
              >
                Fermer
              </button>
              {qrCodeUrl && (
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleDownloadQRCode}
                >
                  Télécharger
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showAddParticipantsModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Ajouter des participants — <span className="text-green-700">{reunion?.titre}</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <ParticipantsAutocomplete
          label="Participants obligatoires"
          selected={requiredParticipants}
          onChange={(next) => {
            const nextOpt = optionalParticipants.filter((u) => !next.some((r) => r.id === u.id));
            setOptionalParticipants(nextOpt);
            setRequiredParticipants(next);
          }}
          excludeIds={optionalParticipants.map((u) => u.id)}
        />
        <ParticipantsAutocomplete
          label="Participants facultatifs"
          selected={optionalParticipants}
          onChange={(next) => {
            const nextReq = requiredParticipants.filter((u) => !next.some((o) => o.id === u.id));
            setRequiredParticipants(nextReq);
            setOptionalParticipants(next);
          }}
          excludeIds={requiredParticipants.map((u) => u.id)}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowAddParticipantsModal(false)}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          onClick={async () => {
            try {
              const payload = {
                reunionId: reunion?.id,
                participantsObligatoires: requiredParticipants.map((p) => p.email),
                participantsFacultatifs: optionalParticipants.map((p) => p.email),
              };
              await axios.post(`${endPoint}/api/Reunion/add-participants`, payload);
              notyf.success("Participants ajoutés avec succès !");
              setShowAddParticipantsModal(false);
              window.location.reload();
            } catch (err) {
              console.error(err);
              notyf.error("Erreur lors de l’ajout des participants");
            }
          }}
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          Ajouter
        </button>
      </div>

      <button
        onClick={() => setShowAddParticipantsModal(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>
    </div>
  </div>
)}

    </DefaultLayout>
  );
};

export default DetailsReunion;
