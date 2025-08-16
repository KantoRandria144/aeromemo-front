import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CustomInput from "../../components/UIElements/Input/CustomInput";
import { getAllUsers } from "../../services/User/UserServices";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { saveReunion } from "../../services/Reunion/ReunionServices";


const ROOMS = ["Salle R+1","Salle R+3","Salle R+4","Salle DSI","Salle CDOU","Salle mezzanine"] as const;


type SimpleUser = { id: string; name: string; email: string; department?: string; };

const initialsOf = (fullName?: string) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const ensureSeconds = (hhmm: string | null) => {
  const v = (hhmm || "").trim();
  if (!v) return "";
  // si "09:00" -> "09:00:00" ; si déjà "09:00:30" on garde
  return v.length === 5 ? `${v}:00` : v;
};

// ---------- Autocomplete contrôlé (réutilisable) ----------
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
        list = (startsWithOnly
          ? list.filter((u) =>
              (u.name || "").toLowerCase().startsWith(v) ||
              (u.email || "").toLowerCase().startsWith(v)
            )
          : list.filter((u) =>
              (u.name || "").toLowerCase().includes(v) ||
              (u.email || "").toLowerCase().includes(v)
            )
        ).filter((u) => !selected.some((s) => s.id === u.id) && !excludeIds.includes(u.id));

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
    if (!selected.some((p) => p.id === u.id) && !excludeIds.includes(u.id)) {
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
                  {initialsOf(u.name)}
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
              {initialsOf(u.name)}
            </div>
            <span className="text-sm mr-2">
              {u.name} {u.department ? `(${u.department})` : ""}
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

      {/* IDs en JSON à soumettre avec le formulaire */}
      <input type="hidden" name={hiddenFieldName} value={JSON.stringify(selected.map((u) => u.id))} />
    </div>
  );
};

// ---------- Page ----------
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const CreateReunion = () => {
  // mutual exclusion state
  const [requiredParticipants, setRequiredParticipants] = useState<SimpleUser[]>([]);
  const [optionalParticipants, setOptionalParticipants] = useState<SimpleUser[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const requiredIds = requiredParticipants.map((u) => u.id);
  const optionalIds = optionalParticipants.map((u) => u.id);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);

    const payload = {
      titre: String(form.get("titre") || "").trim(),
      description: String(form.get("description") || "").trim(),
      dateDebut: String(form.get("dateDebut") || "").trim(), // "YYYY-MM-DD"
      dateFin: String(form.get("dateFin") || "").trim(),     // "YYYY-MM-DD"
      heureDebut: ensureSeconds(String(form.get("heureDebut"))), // "HH:mm:ss"
      heureFin: ensureSeconds(String(form.get("heureFin"))),     // "HH:mm:ss"
      emplacement: String(form.get("emplacement") || "").trim(),
      etat: 1,
      participantsObligatoires: (() => {
        try { return JSON.parse(String(form.get("participantsObligatoiresIds") || "[]")); }
        catch { return []; }
      })(),
      participantsFacultatifs: (() => {
        try { return JSON.parse(String(form.get("participantsFacultatifsIds") || "[]")); }
        catch { return []; }
      })(),
    };

    // petite validation rapide
    if (!payload.titre || !payload.description || !payload.dateDebut || !payload.heureDebut || !payload.heureFin || !payload.emplacement) {
      notyf.error("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      await saveReunion(payload as any);
      notyf.success("Réunion créée avec succès !");
      // reset visuel
      (e.currentTarget as HTMLFormElement).reset();
      setRequiredParticipants([]);
      setOptionalParticipants([]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Une erreur est survenue lors de l’enregistrement.";
      notyf.error(msg);
    } finally {
      setSubmitting(false);
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
            <form className="space-y-4" onSubmit={onSubmit}>
              <CustomInput type="text" name="titre" label="Titre" defaultValue="" placeholder="Titre de la réunion" rounded="medium" required />

              <div className="grid md:grid-cols-2 gap-4">
                <CustomInput type="date" name="dateDebut" label="Date de début" defaultValue="" rounded="medium" required />
                <CustomInput type="date" name="dateFin" label="Date de fin" defaultValue="" rounded="medium" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <CustomInput type="time" name="heureDebut" label="Heure de début" defaultValue="" rounded="medium" required />
                <CustomInput type="time" name="heureFin" label="Heure de fin" defaultValue="" rounded="medium" required />
              </div>

              {/* Emplacement: liste déroulante */}
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
                  <option value="" disabled>Choisir une salle…</option>
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
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

              {/* Participants obligatoires */}
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
                excludeIds={optionalIds}
                hiddenFieldName="participantsObligatoiresIds"
              />

              {/* Participants facultatifs */}
              <ParticipantsAutocomplete
                label="Participants facultatifs"
                placeholder="Tapez pour rechercher (ex : a...)"
                selected={optionalParticipants}
                onChange={(next) => {
                  const nextRequired = requiredParticipants.filter((u) => !next.some((o) => o.id === u.id));
                  setRequiredParticipants(nextRequired);
                  setOptionalParticipants(next);
                }}
                excludeIds={requiredIds}
                hiddenFieldName="participantsFacultatifsIds"
              />

              {/* Actions */}
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
      </div>
    </DefaultLayout>
  );
};

export default CreateReunion;
