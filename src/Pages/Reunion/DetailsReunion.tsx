import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { getReunionById } from "../../services/Reunion/ReunionServices";
import { Reunion } from "../../types/reunion";
import { formatDate, formatTime } from "../../services/Function/DateServices";
import { generateQRCode } from "../../services/Reunion/QRCodeService";
import { QrCode } from "lucide-react";

const DetailsReunion = () => {
  const { id } = useParams<{ id: string }>();
  const [reunion, setReunion] = useState<Reunion | null>(null);
  const [loading, setLoading] = useState(true);
 const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
const [showQRModal, setShowQRModal] = useState(false);
  useEffect(() => {
    const fetchReunion = async () => {
      try {
        if (id) {
          const data = await getReunionById(id);
          setReunion(Array.isArray(data) ? data[0] : data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la réunion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReunion();
  }, [id]);

 const handleGenerateQRCode = async () => {
  if (!reunion?.id) return;
  
  setQrCodeLoading(true);
  try {
    const qrCodeData = {
      reunionid: reunion.id,
      tokens: "10",
      etat: "active"
    };

    const qrCodeBlob = await generateQRCode(qrCodeData);
    const url = URL.createObjectURL(qrCodeBlob);
    setQrCodeUrl(url);
    setShowQRModal(true);
    
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error);
    alert("Erreur lors de la génération du QR code");
  } finally {
    setQrCodeLoading(false);
  }
};


  const handleDownloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode_${reunion?.id || 'reunion'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Chargement...</p>;
  if (!reunion) return <p>Aucune donnée trouvée</p>;

  return (
    <DefaultLayout>
      {/* ================== new design start =================== */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">Réunion</h2>
        <p className="text-sm text-gray-500 mb-4">Details</p>
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Informations générales */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-center font-bold text-zinc-400 text-xl md:text-2xl">
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

            <p>
              Lien de la réunion:{reunion.teamsMeetingLink}
              <a
                href={reunion.teamsMeetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              ></a>
            </p>
            <p>ID de la réunion: {reunion.teamsMeetingId}</p>
            <p>Code secret: {reunion.teamsSecretCode}</p>
          </div>

          {/* Liste des participants */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Liste des participants</h3>
              <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                + Ajouter un participant
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {reunion.participantsObligatoires?.map((p: any, idx: number) => (
                  <tr key={idx} className="">
                    <td className=" px-4 py-2">{p.nom || p}</td>
                    <td className="  px-4 py-2">{p.email || p}</td>
                  </tr>
                ))}
                {reunion.participantsFacultatifs?.map(
                  (p: any, idx: number) => (
                    <tr key={`f-${idx}`} className="">
                      <td className=" px-4 py-2">{p.nom || p}</td>
                      <td className="  px-4 py-2">{p.email || p}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        
          {/* Boutons d'action */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleGenerateQRCode}
               disabled={qrCodeLoading}
              className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <QrCode size={18} />Générer QR Code
            </button>
            <button className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg shadow hover:bg-green-50">
              Activer transcription audio
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
              Générer CR
            </button>
          </div>
        </div>
      </div>
      {/* ================== new design end =================== */}
      {showQRModal && qrCodeUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">QR Code Généré</h3>
      <img 
        src={qrCodeUrl} 
        alt="QR Code" 
        className="w-64 h-64 mx-auto mb-4"
      />
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleDownloadQRCode}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
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
