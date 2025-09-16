import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { getAllUsers } from "../../services/User/UserServices";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { saveReunion, formatTeamsInfo, copyTeamsInfoToClipboard } from "../../services/Reunion/ReunionServices";
import axios from "axios";
import { getThreeInitials } from "../../services/Function/UserFonctionService";
import { useNavigate } from "react-router-dom";

const ROOMS = ["Salle R+1", "Salle R+3", "Salle R+4", "Salle DSI", "Salle CDOU", "Salle mezzanine"] as const;

type SimpleUser = { id: string; name: string; email: string; department?: string };

const ensureSeconds = (hhmm: string | null) => {
  const v = (hhmm || "").trim();
  if (!v) return "";
  return v.length === 5 ? `${v}:00` : v;
};

type ParticipantsAutocompleteProps = {
  label: string;
  requiredLabel?: boolean;
  placeholder?: string;
  startsWithOnly?: boolean;
  selected: SimpleUser[];
  onChange: (next: SimpleUser[]) => void;
  excludeIds?: string[];
  hiddenFieldName: string;
};

const ParticipantsAutocomplete: React.FC<ParticipantsAutocompleteProps> = ({
  label,
  requiredLabel = false,
  placeholder = "Rechercher un utilisateur…",
  startsWithOnly = true,
  selected,
  onChange,
  excludeIds = [],
  hiddenFieldName,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SimpleUser[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const data = await getAllUsers(q);
        let list: SimpleUser[] = Array.isArray(data) ? data : [];
        const v = q.toLowerCase();

        list =
          startsWithOnly
            ? list.filter(
                (u) =>
                  (u.name || "").toLowerCase().startsWith(v) ||
                  (u.email || "").toLowerCase().startsWith(v)
              )
            : list.filter(
                (u) =>
                  (u.name || "").toLowerCase().includes(v) ||
                  (u.email || "").toLowerCase().includes(v)
              );

        list = list.filter(
          (u) => !selected.some((s) => s.id === u.id) && !(excludeIds || []).includes(u.id)
        );

        setSuggestions(list);
        setOpen(list.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, startsWithOnly, excludeIds, selected]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const addOne = (u: SimpleUser) => {
    if (!selected.some((p) => p.id === u.id) && !(excludeIds || []).includes(u.id)) {
      onChange([...selected, u]);
    }
    setQuery("");
    setOpen(false);
  };

  const removeOne = (id: string) => onChange(selected.filter((p) => p.id !== id));

  return (
    <div ref={boxRef}>
      <label className="mb-1 block font-semibold text-sm text-black dark:text-white">
        {label} {requiredLabel && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(suggestions.length > 0)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />

        {open && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-md border bg-white shadow-lg dark:bg-boxdark dark:border-form-strokedark">
            {suggestions.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => addOne(u)}
                className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 dark:hover:bg-boxdark2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm">
                  {getThreeInitials(u.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{u.name}</span>
                  <span className="text-xs text-gray-500">{u.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((u) => (
          <div key={u.id} className="flex items-center bg-gray-100 dark:bg-boxdark rounded-full px-3 py-1">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs mr-2">
              {getThreeInitials(u.name)}
            </div>
            <span className="text-sm mr-2">
              {u.name}
            </span>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => removeOne(u.id)}
              aria-label={`Retirer ${u.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input type="hidden" name={hiddenFieldName} value={JSON.stringify(selected.map((u) => u.id))} />
    </div>
  );
};

const notyf = new Notyf({ position: { x: "center", y: "top" } });

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Impossible de décoder le token:", e);
    return null;
  }
}

const CreateReunion = () => {
  const [requiredParticipants, setRequiredParticipants] = useState<SimpleUser[]>([]);
  const [optionalParticipants, setOptionalParticipants] = useState<SimpleUser[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [outlookUrl, setOutlookUrl] = useState<string | null>(null);
  const [teamsUrl, setTeamsUrl] = useState<string | null>(null);
  const [teamsInfo, setTeamsInfo] = useState<string | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTeamsInfoModal, setShowTeamsInfoModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const token = localStorage.getItem("_au_pr") || "";
  const decoded = parseJwt(token);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || !formRef.current) return;

    const form = new FormData(e.currentTarget);

    const titre = String(form.get("titre") || "").trim();
    const description = String(form.get("description") || "").trim();
    const dateDebut = String(form.get("dateDebut") || "").trim();
    const dateFin = String(form.get("dateFin") || "").trim();
    const heureDebut = String(form.get("heureDebut") || "").trim();
    const heureFin = String(form.get("heureFin") || "").trim();
    const emplacement = String(form.get("emplacement") || "").trim();
    const userid = localStorage.getItem("userId") || "";
    
    console.log("userid récupéré depuis localStorage:", userid);

    const payload = {
      titre,
      description,
      dateDebut,
      dateFin,
      heureDebut: ensureSeconds(heureDebut),
      heureFin: ensureSeconds(heureFin),
      emplacement,
      etat: 1,
      participantsObligatoires: requiredParticipants.map(p => p.email),
      participantsFacultatifs: optionalParticipants.map(p => p.email),
      userId: userid, // Changé de userid à userId
    };

    console.log("Payload préparé:", JSON.stringify(payload, null, 2));

    // Validation
    if (!payload.titre || !payload.description || !payload.dateDebut || 
        !payload.heureDebut || !payload.heureFin || !payload.emplacement) {
      notyf.dismissAll();
      notyf.error("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await saveReunion(payload);
      
      // Utiliser les URLs générées par le backend
      setOutlookUrl(response.outlookUrl);
      setTeamsUrl(response.teamsMeetingLink);
      
      // Générer les informations Teams formatées
      const formattedTeamsInfo = formatTeamsInfo(response.reunion);
      setTeamsInfo(formattedTeamsInfo);
      
      // Copier automatiquement les infos Teams dans le clipboard
      const copied = await copyTeamsInfoToClipboard(response.reunion);
      if (copied) {
        notyf.success("Informations Teams copiées dans le presse-papier !");
      }
      setShowCalendarModal(true);
      //navigate(`/aeromemo/reunion/${response.reunion.id}`);
      notyf.success("Réunion créée avec succès !");
      
      // Réinitialiser le formulaire
      formRef.current.reset();
      setRequiredParticipants([]);
      setOptionalParticipants([]);
      
    } catch (error) {
      let msg = "Une erreur est survenue lors de l'enregistrement.";
      
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || 
              error.response?.data?.error ||
              error.message || 
              msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      
      notyf.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTeamsInfo = async () => {
    if (teamsInfo) {
      await navigator.clipboard.writeText(teamsInfo);
      notyf.success("Informations Teams copiées !");
    }
  };

  return (
    <DefaultLayout>
      <div className="text-sm mx-2 p-4 md:mx-5">
        <Breadcrumb
          paths={[
            { name: "Réunion", to: "/aeromemo/planification" },
            { name: "Créer Réunion" },
          ]}
        />

        <div className="relative mt-2 bg-white p-4 shadow-1 rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
          <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg">
            Créer une nouvelle réunion
          </div>

          <div className="pt-2 w-full px-2 md:px-20 lg:px-30 xl:px-50">
            <form className="space-y-4" onSubmit={onSubmit} ref={formRef}>
              <CustomInput type="text" name="titre" label="Titre" defaultValue="" placeholder="Titre de la réunion" rounded="medium" required />

              <div className="grid md:grid-cols-2 gap-4">
                <CustomInput type="date" name="dateDebut" label="Date de début" defaultValue="" rounded="medium" required />
                <CustomInput type="date" name="dateFin" label="Date de fin" defaultValue="" rounded="medium" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <CustomInput type="time" name="heureDebut" label="Heure de début" defaultValue="" rounded="medium" required />
                <CustomInput type="time" name="heureFin" label="Heure de fin" defaultValue="" rounded="medium" required />
              </div>

              <div>
                <label htmlFor="emplacement" className="mb-1 block font-semibold text-sm text-black dark:text-white">
                  Emplacement
                </label>
                <select
                  id="emplacement"
                  name="emplacement"
                  defaultValue=""
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="" disabled>
                    Choisir une salle…
                  </option>
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block font-semibold text-sm text-black dark:text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue=""
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  placeholder="Description de la réunion..."
                  required
                />
              </div>

              <ParticipantsAutocomplete
                label="Participants obligatoires"
                requiredLabel
                placeholder="Tapez pour rechercher (ex : a...)"
                selected={requiredParticipants}
                onChange={(next) => {
                  const nextOptional = optionalParticipants.filter((u) => !next.some((r) => r.id === u.id));
                  setOptionalParticipants(nextOptional);
                  setRequiredParticipants(next);
                }}
                excludeIds={optionalParticipants.map(u => u.id)}
                hiddenFieldName="participantsObligatoiresIds"
              />

              <ParticipantsAutocomplete
                label="Participants facultatifs"
                placeholder="Tapez pour rechercher (ex : a...)"
                selected={optionalParticipants}
                onChange={(next) => {
                  const nextRequired = requiredParticipants.filter((u) => !next.some((o) => o.id === u.id));
                  setRequiredParticipants(nextRequired);
                  setOptionalParticipants(next);
                }}
                excludeIds={requiredParticipants.map(u => u.id)}
                hiddenFieldName="participantsFacultatifsIds"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 border border-zinc-300 rounded-lg dark:bg-transparent dark:hover:bg-boxdark2"
                  onClick={() => window.history.back()}
                  disabled={submitting}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="md:w-fit gap-2 w-full cursor-pointer py-2 px-5 text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Création..." : "Créer la réunion"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal d'options calendrier */}
        {showCalendarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Réunion créée avec succès !</h3>
              <p className="mb-4">Que souhaitez-vous faire maintenant ?</p>
              
              <div className="space-y-3 mb-6">
                {outlookUrl && (
                  <button
                    onClick={() => {
                      window.open(outlookUrl, '_blank');
                      setShowCalendarModal(false);
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    Ouvrir dans Outlook
                  </button>
                )}
                
                {teamsUrl && (
                  <button
                    onClick={() => {
                      window.open(teamsUrl, '_blank');
                      setShowCalendarModal(false);
                    }}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Rejoindre Teams
                  </button>
                )}

                {teamsInfo && (
                  <button
                    onClick={() => {
                      setShowTeamsInfoModal(true);
                      setShowCalendarModal(false);
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    Voir infos Teams
                  </button>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="px-4 py-2 border rounded-md dark:border-form-strokedark dark:bg-boxdark-2 dark:text-white hover:bg-gray-100 dark:hover:bg-boxdark-3"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'informations Teams */}
        {showTeamsInfoModal && teamsInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Informations de réunion Teams</h3>
              
              <div className="bg-gray-100 dark:bg-boxdark-2 p-4 rounded-md mb-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {teamsInfo}
                </pre>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handleCopyTeamsInfo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Copier
                </button>
                
                <button
                  onClick={() => setShowTeamsInfoModal(false)}
                  className="px-4 py-2 border rounded-md dark:border-form-strokedark dark:bg-boxdark-2 dark:text-white hover:bg-gray-100 dark:hover:bg-boxdark-3"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CreateReunion;