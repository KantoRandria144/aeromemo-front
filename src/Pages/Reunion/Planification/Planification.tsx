import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import CustomSelect from "../../../components/UIElements/Select/CustomSelect";
import CustomInput from "../../../components/UIElements/Input/CustomInput";
import DefaultLayout from "../../../components/layout/DefaultLayout";
import { EtatReunion, Reunion } from "../../../types/reunion";
import { getMyReunions, listAllReunion } from "../../../services/Reunion/ReunionServices";
import { getThreeInitials } from "../../../services/Function/UserFonctionService";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { LayoutGrid, CalendarDays } from "lucide-react";
import frLocale from "@fullcalendar/core/locales/fr";
import { outlookService, OutlookEvent } from "../../../services/Reunion/outlookService";
import PerPageInput from "../../../components/UIElements/PerPageInput";
import Pagination from "../../../components/Tables/Pagination";
const TYPE_REUNION_OPTIONS = [
  { value: 1, label: "Transverse" },
  { value: 2, label: "Projet" },
];
const getTypeLabelFromReunion = (r: any): string | undefined => {
  // Le backend peut renvoyer:
  // - r.type_reunion: "Projet"/"Transverse" (le plus courant)
  // - r.type: 1/2 (éventuellement)
  // - r.typeReunion: idem
  const raw = r?.type_reunion ?? r?.type ?? r?.typeReunion;

  if (raw == null) return undefined;

  if (typeof raw === "string") {
    return raw.trim(); // "Projet" / "Transverse"
  }

  // si c'est numérique (1/2), mappe vers libellé
  const found = TYPE_REUNION_OPTIONS.find(o => o.value === Number(raw));
  return found?.label;
};
const Planification = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<"list" | "calendar">("list");
    const [activeTab, setActiveTab] = useState<"all" | "mine" | "outlook">("all");
    const [reunions, setReunions] = useState<Reunion[]>([]);
    const [outlookEvents, setOutlookEvents] = useState<OutlookEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [outlookLoading, setOutlookLoading] = useState<boolean>(false);
    const [selectedReunions, setSelectedReunions] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [actualPage, setActualPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState(1);
    //const today = new Date().toISOString().split("T")[0];

    const [filters, setFilters] = useState({
    typeReunion: undefined as number | undefined,
    dateDebut: "",
    dateFin: "",
    });

     const fetchData = async () => {
    try {
      setLoading(true);
      let data: Reunion[] = [];

      if (activeTab === "all") {
        data = await listAllReunion({
          typeReunion: filters.typeReunion ? Number(filters.typeReunion) : undefined,
          dateDebutMin: filters.dateDebut || undefined,
          dateDebutMax: filters.dateFin || undefined,
        });
      } else if (activeTab === "mine") {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          data = await getMyReunions(storedUserId, {
            typeReunion: filters.typeReunion ? Number(filters.typeReunion) : undefined,
            dateDebutMin: filters.dateDebut || undefined,
            dateDebutMax: filters.dateFin || undefined,
          });
        }
      } else if (activeTab === "outlook") {
        setOutlookLoading(true);
        try {
          const events = await outlookService.getEvents();
          setOutlookEvents(events);
        } finally {
          setOutlookLoading(false);
        }
      }

      setReunions(data);
      const totalItems = activeTab === "outlook" ? outlookEvents.length : data.length;
      setPageNumbers(Math.ceil(totalItems / entriesPerPage));
    } catch (error) {
      console.error("Erreur lors du chargement des réunions:", error);
      setReunions([]);
      setPageNumbers(1);
    } finally {
      setLoading(false);
    }
  };
   
useEffect(() => {
    fetchData();
  }, [activeTab, entriesPerPage]);


    const handleSelectAllReunions = () => {
        if (reunions) {
            if (selectedReunions.length < reunions.length) {
                setSelectedReunions([]);
                reunions.map((r) => setSelectedReunions((prev) => [...prev, r.id]));
                setIsAllSelected(true);
            } else {
                setSelectedReunions([]);
                setIsAllSelected(false);
            }
        }
    };

    const handleSelectReunion = (reunionId: string) => {
        setSelectedReunions((prev) => {
            if (prev.includes(reunionId)) {
                return prev.filter((id) => id !== reunionId);
            } else {
                return [...prev, reunionId];
            }
        });
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
    setFilters({
        typeReunion: "",
        dateDebut: today,
        dateFin: today,
    });
    };


    const filteredReunions = reunions.filter((reunion) => {
    // === On récupère le type réel ===
    const raw = reunion.type_reunion ?? reunion.type ?? reunion.typeReunion;

    // Normalisation
    let currentValue: number | null = null;

    if (typeof raw === "number") {
        currentValue = raw;
    } else if (typeof raw === "string") {
        const t = raw.trim().toLowerCase();
        if (t.includes("projet") || t === "2") currentValue = 2;
        else if (t.includes("transverse") || t === "1") currentValue = 1;
    }

    // === Filtre par type si un filtre est défini ===
    if (filters.typeReunion && Number(filters.typeReunion) !== currentValue) {
        return false;
    }
    if (!filters.dateDebut && !filters.dateFin) return true;
    // === Filtre par date ===
    const dateDebut = new Date(reunion.dateDebut);
    const dateFin = new Date(reunion.dateFin || reunion.dateDebut);
    // const min = new Date(filters.dateDebut);
    // const max = new Date(filters.dateFin);

if (filters.dateDebut && dateDebut < new Date(filters.dateDebut)) return false;
if (filters.dateFin && dateFin > new Date(filters.dateFin)) return false;


    return true;
    });




    const filteredOutlookEvents = outlookEvents.filter(event => {
        if (!filters.dateDebut && !filters.dateFin) return true;
        if (filters.dateDebut && new Date(event.start.dateTime) < new Date(filters.dateDebut)) return false;
        if (filters.dateFin && new Date(event.end.dateTime) > new Date(filters.dateFin)) return false;
        return true;
    });

    const events = [
        ...filteredReunions.map(reunion => ({
            id: reunion.id,
            title: reunion.titre,
            start: reunion.dateDebut,
            end: reunion.dateFin || reunion.dateDebut,
            extendedProps: {
                etat: reunion.etat,
                type: 'reunion'
            }
        })),
        ...filteredOutlookEvents.map(event => ({
            id: event.id,
            title: event.subject || 'Sans titre',
            start: event.start.dateTime,
            end: event.end.dateTime,
            extendedProps: {
                type: 'outlook',
                organizer: event.organizer?.emailAddress.name
            }
        }))
    ];

     const getPaginatedData = () => {
    const startIndex = (actualPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    if (activeTab === "outlook") return filteredOutlookEvents.slice(startIndex, endIndex);
    return filteredReunions.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const totalItems =
      activeTab === "outlook" ? filteredOutlookEvents.length : filteredReunions.length;
    const totalPages = Math.ceil(totalItems / entriesPerPage);
    setPageNumbers(totalPages);
    if (actualPage > totalPages) setActualPage(1);
  }, [filteredReunions, filteredOutlookEvents, entriesPerPage, activeTab]);

    // Composant pour afficher un participant avec la couleur appropriée
    const ParticipantAvatar = ({ nom, type, showTooltip = true }: { 
    nom: string; 
    type: 'obligatoire' | 'facultatif'| 'organizer';
    showTooltip?: boolean;
}) => {
    const initials = getThreeInitials(nom);

    // Appliquer les bonnes couleurs : obligatoire = bleu, facultatif = jaune
    const bgColor = type === 'obligatoire' 
        ? 'bg-cyan-100 text-cyan-600 border-cyan-300  dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700'     // bleu clair
        : 'bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700'; // jaune clair
    
    return (
        <div className="relative group -ml-2 first:ml-0 hover:z-99 cursor-pointer">
            <p className={`text-xs border relative ${bgColor} p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent`}>
                {initials}
            </p>
            {showTooltip && (
                <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                    <p>{nom} </p>
                    <span className={`text-xs px-2 rounded-full ${bgColor}`}>
                        {type === 'organizer' ? 'Organisateur' : type === 'obligatoire' ? 'Obligatoire' : 'Facultatif'}
                    </span>
                </div>
            )}
        </div>
    );
};

    // Composant pour la vue calendrier
    const CalendarView = () => (
        <div className="p-4">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                 locales={[frLocale]}       // 👈 on ajoute la locale
                 locale="fr" 
                headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                eventClick={(info) => {
                    if (info.event.extendedProps.type === 'reunion') {
                        navigate(`/aeromemo/reunion/${info.event.id}`);
                    } else {
                        // Pour les événements Outlook, ouvrir le lien web s'il existe
                        const outlookEvent = outlookEvents.find(e => e.id === info.event.id);
                        if (outlookEvent?.webLink) {
                            window.open(outlookEvent.webLink, '_blank');
                        }
                    }
                }}
                height="70vh"
                eventContent={(eventInfo) => (
                    <div className={`p-1 ${eventInfo.event.extendedProps.type === 'outlook' ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}>
                        <b>{eventInfo.event.title}</b>
                        <div className="text-xs">
                            {eventInfo.timeText}
                        </div>
                        {eventInfo.event.extendedProps.type === 'outlook' && (
                            <div className="text-xs text-blue-600">Outlook</div>
                        )}
                    </div>
                )}
            />
        </div>
    );

    // Fonction pour formater la date des événements Outlook
    // Fonction pour formater la date des événements Outlook
const formatDateTime = (dateTime: string, timeZone: string) => {
  const date = new Date(dateTime);

  // On extrait jour/mois/année (sur 2 chiffres)
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  // Heure et minute
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} à ${hours}:${minutes} `;
};


    return (
        <DefaultLayout>
            <div className="mx-2 py-4 md:mx-10">
                <>
                 
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        {/* <Breadcrumb
                            paths={[{ name: "Liste des Projets", to: "/aeromemo/planification" }]}
                        /> */}
                         <div className="">
                            <nav className="flex items-center gap-2">
                                <button
                                onClick={() => setActiveView("list")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                    activeView === "list"
                                    ? "bg-green-100 text-green-600"
                                    : "text-black hover:text-green-600"
                                }`}
                                >
                                <LayoutGrid size={25} />
                                
                                </button>

                                <button
                                onClick={() => setActiveView("calendar")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                                    activeView === "calendar"
                                    ? "bg-green-100 text-green-600"
                                    : "text-black hover:text-green-600"
                                }`}
                                >
                                <CalendarDays size={25} />
                               
                                </button>
                            </nav>
                        </div>
                     

                        <button
                            onClick={() => navigate("/aeromemo/créer-réunion")}
                            className="md:w-fit mb-2 gap-2 flex justify-center w-full md:w-auto cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform"
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 12H18M12 6V18"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                            Créer un nouveau réunion
                        </button> 
                    </div>

                    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-center mt-2">
                            <nav className="flex overflow-x-auto items-center p-1 space-x-1 text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
                                <button 
                                    onClick={() => setActiveTab("all")}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeTab === "all"
                                            ? "bg-green-600 text-white"
                                            : "hover:text-green-600"
                                    }`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setActiveTab("mine")}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeTab === "mine"
                                            ? "bg-green-600 text-white"
                                            : "hover:text-green-600"
                                    }`}
                                >
                                    Mes réunions
                                </button>
                                <button
                                    onClick={() => setActiveTab("outlook")}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeTab === "outlook"
                                            ? "bg-green-600 text-white"
                                            : "hover:text-green-600"
                                    }`}
                                >
                                    Événements Outlook
                                </button>
                            </nav>
                        </div>

                        <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full">
                        



                                <CustomInput
                                    type="date"
                                    value={filters.dateDebut}
                                    label="Du"
                                    rounded="medium"
                                    onChange={(e) => handleFilterChange("dateDebut", e.target.value)}
                                />
                                <CustomInput
                                    type="date"
                                    value={filters.dateFin}
                                    label="Au"
                                    rounded="medium"
                                    onChange={(e) => handleFilterChange("dateFin", e.target.value)}
                                />
                                <div className="flex items-end gap-2 mx-3">
                                    <div className="pb-2">
                                        <button 
                                            className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit"
                                            onClick={clearFilters}
                                        >
                                            Effacer les filtres
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                stroke="#00AE5D"
                                            >
                                                <path
                                                    d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActualPage(1);
                                                fetchData();
                                            }}
                                            className="px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform"
                                        >
                                            Rechercher
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {activeView === "calendar" ? (
                            <CalendarView />
                        ) : (
                            <>
                                {/* Bulk actions when items are selected */}
                                {activeTab !== "outlook" && (
                                    <div
                                        className={`mt-2 border-primaryGreen border dark:border-formStrokedark bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
                                            selectedReunions.length > 0
                                                ? "scale-y-100 opacity-100"
                                                : "scale-y-0 opacity-0"
                                        }`}
                                    >
                                        <div>
                                            {selectedReunions.length === 1
                                                ? "1 élément sélectionné"
                                                : `${selectedReunions.length} éléments sélectionnés`}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    // Handle bulk actions here
                                                }}
                                                className="mb-1 mt-1 min-w-20 w-full text-sm py-2.5 px-3 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-lg text-left text-black"
                                            >
                                                Actions
                                            </button>
                                        </div>
                                    </div>
                                )}
                             
                                <div className="max-w-full overflow-x-auto">
                                    <table className="w-full text-sm hidden md:table table-auto">
                                        <thead className="pt-5 rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
                                            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
                                                {/* {activeTab !== "outlook" && (
                                                    <th className="pl-2">
                                                        <button
                                                            onClick={handleSelectAllReunions}
                                                            className="cursor-pointer border w-5 h-5"
                                                        >
                                                            <svg
                                                                width="18"
                                                                height="17"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className={`${
                                                                    selectedReunions.length === reunions.length
                                                                        ? "visible"
                                                                        : "invisible"
                                                                }`}
                                                            >
                                                                <path
                                                                    d="M4 12.6111L8.92308 17.5L20 6.5"
                                                                    stroke="#fff"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </th>
                                                )} */}
                                                {activeTab === "all" ? (
                                                    <>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Date</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Titre</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Participants</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Statuts</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Actions</span>
                                                    </div>
                                                </th>
                                                    </>
                                                ) : activeTab === "mine" ? (
                                                    <>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Date</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Titre</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Participant</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Statut</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                    <div className="flex items-center gap-1">
                                                        <span>Actions</span>
                                                    </div>
                                                </th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Date</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Titre</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Organisateur</span>
                                                            </div>
                                                        </th>
                                                        <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                                                            <div className="flex items-center gap-1">
                                                                <span>Participants</span>
                                                            </div>
                                                        </th>
                                                    </>
                                                )}
                                               
                                            </tr>
                                        </thead>
                                       <tbody>
                                        {activeTab === "all" ? (
                                            getPaginatedData() && getPaginatedData().length > 0 ? (
                                            getPaginatedData().map((reunion) => (
                                                <tr key={reunion.id} className="border-b hover:bg-gray-50 dark:hover:bg-boxdark2">
                                                {/* <td className="pl-2 border-b border-[#eee] dark:border-strokedark">
                                                    <button
                                                    className="cursor-pointer border w-5 h-5"
                                                    onClick={() => handleSelectReunion(reunion.id)}
                                                    >
                                                    <svg
                                                        width="18"
                                                        height="17"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`${
                                                        selectedReunions.includes(reunion.id) ? "visible" : "invisible"
                                                        }`}
                                                    >
                                                        <path
                                                        d="M4 12.6111L8.92308 17.5L20 6.5"
                                                        className="stroke-black-2 dark:stroke-whiten"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    </button>
                                                </td> */}
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    {new Date(reunion.dateDebut).toLocaleDateString()}
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <p className="text-black text-justify dark:text-white font-bold">{reunion.titre}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    {/* Participants OBLIGATOIRES et FACULTATIFS */}
                                                    <div className="flex -ml-2">
                                                    {reunion.participantsObligatoires?.slice(0, 3).map((nom, index) => (
                                                        <ParticipantAvatar key={index} nom={nom} type="obligatoire" />
                                                    ))}

                                                    {reunion.participantsFacultatifs?.slice(0, 2).map((nom, index) => (
                                                        <ParticipantAvatar key={index} nom={nom} type="facultatif" />
                                                    ))}

                                                    {(reunion.participantsObligatoires?.length > 3 ||
                                                        reunion.participantsFacultatifs?.length > 2) && (
                                                        <div className="relative group -ml-2 first:ml-0">
                                                        <p className="text-slate-50 border relative bg-gray-400 p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                                                            +
                                                            {(reunion.participantsObligatoires?.length > 3
                                                            ? reunion.participantsObligatoires.length - 3
                                                            : 0) +
                                                            (reunion.participantsFacultatifs?.length > 2
                                                                ? reunion.participantsFacultatifs.length - 2
                                                                : 0)}
                                                        </p>
                                                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                                                            <div>
                                                            <p className="font-semibold">Participants supplémentaires:</p>
                                                            {reunion.participantsObligatoires?.length > 3 && (
                                                                <p>{reunion.participantsObligatoires.length - 3} obligatoire(s)</p>
                                                            )}
                                                            {reunion.participantsFacultatifs?.length > 2 && (
                                                                <p>{reunion.participantsFacultatifs.length - 2} facultatif(s)</p>
                                                            )}
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )}
                                                    </div>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <p
                                                    className={`font-semibold rounded-md text-center py-1 px-2 text-xs w-fit ${
      reunion.etat === "Planifie"
        ? "bg-green-100 border text-green-600 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
      : reunion.etat === "EnCours"
        ? "bg-cyan-100 border text-cyan-600 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700"
      : reunion.etat === "Termine"
        ? "bg-emerald-100 border text-emerald-600 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700"
      : reunion.etat === "Annule"
        ? "bg-red-100 border text-red-600 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
      : "bg-green-100 border text-green-600 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
    }`}
                                                    >
                                                    {EtatReunion[reunion.etat as keyof typeof EtatReunion] || reunion.etat}

                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <button
                                                    onClick={() => navigate(`/aeromemo/reunion/${reunion.id}`)}
                                                    className="text-primaryGreen hover:underline dark:text-darkgreen"
                                                    >
                                                    Voir
                                                    </button>
                                                </td>
                                                </tr>
                                            ))
                                            ) : (
                                            <tr>
                                                <td
                                                colSpan={7}
                                                className="text-center py-4 border-b border-[#eee] dark:border-strokedark"
                                                >
                                                Aucune réunion trouvée
                                                </td>
                                            </tr>
                                            )
                                        ) : activeTab === "mine" ? (
                                            getPaginatedData() && getPaginatedData().length > 0 ? (
                                            getPaginatedData().map((reunion) => (
                                                <tr key={reunion.id} className="border-b hover:bg-gray-50 dark:hover:bg-boxdark2">
                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                        <button
                                                            className="cursor-pointer border w-5 h-5"
                                                            onClick={() => handleSelectReunion(reunion.id)}
                                                        >
                                                            <svg
                                                                width="18"
                                                                height="17"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className={`${
                                                                    selectedReunions.includes(reunion.id) ? "visible" : "invisible"
                                                                }`}
                                                            >
                                                                <path
                                                                    d="M4 12.6111L8.92308 17.5L20 6.5"
                                                                    className="stroke-black-2 dark:stroke-whiten"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                    {new Date(reunion.dateDebut).toLocaleDateString()}
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                    {reunion.titre}
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                    {/* Participants comme dans "all" */}
                                                    <div className="flex -ml-2">
                                                    {reunion.participantsObligatoires?.slice(0, 3).map((nom, index) => (
                                                        <ParticipantAvatar key={index} nom={nom} type="obligatoire" />
                                                    ))}

                                                    {reunion.participantsFacultatifs?.slice(0, 2).map((nom, index) => (
                                                        <ParticipantAvatar key={index} nom={nom} type="facultatif" />
                                                    ))}

                                                    {(reunion.participantsObligatoires?.length > 3 ||
                                                        reunion.participantsFacultatifs?.length > 2) && (
                                                        <div className="relative group -ml-2 first:ml-0">
                                                        <p className="text-slate-50 border relative bg-gray-400 p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                                                            +
                                                            {(reunion.participantsObligatoires?.length > 3
                                                            ? reunion.participantsObligatoires.length - 3
                                                            : 0) +
                                                            (reunion.participantsFacultatifs?.length > 2
                                                                ? reunion.participantsFacultatifs.length - 2
                                                                : 0)}
                                                        </p>
                                                        <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                                                            <div>
                                                            <p className="font-semibold">Participants supplémentaires:</p>
                                                            {reunion.participantsObligatoires?.length > 3 && (
                                                                <p>{reunion.participantsObligatoires.length - 3} obligatoire(s)</p>
                                                            )}
                                                            {reunion.participantsFacultatifs?.length > 2 && (
                                                                <p>{reunion.participantsFacultatifs.length - 2} facultatif(s)</p>
                                                            )}
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )}
                                                    </div>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                    {reunion.etat}
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                                    <button
                                                    onClick={() => navigate(`/aeromemo/reunion/${reunion.id}`)}
                                                    className="text-primaryGreen hover:underline dark:text-darkgreen"
                                                    >
                                                    Voir
                                                    </button>
                                                </td>
                                                </tr>
                                            ))
                                            ) : (
                                            <tr>
                                                <td colSpan={7} className="text-center py-4">
                                                Aucune de vos réunions trouvée
                                                </td>
                                            </tr>
                                            )
                                        ) : activeTab === "outlook" ? (
                                            outlookLoading ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-4">
                                                        Chargement des événements Outlook...
                                                    </td>
                                                </tr>
                                            ) : getPaginatedData() && getPaginatedData().length > 0 ? (
                                                getPaginatedData().map((event) => (
                                                    <tr key={event.id} className="border-b hover:bg-gray-50 dark:hover:bg-boxdark2">
                                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            {formatDateTime(event.start.dateTime, event.start.timeZone)}
                                                        </td>
                                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <p className="text-black text-justify dark:text-white font-bold">{event.subject || 'Sans titre'}</p>
                                                            {/* {event.bodyPreview && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                    {event.bodyPreview.substring(0, 100)}...
                                                                </p>
                                                            )} */}
                                                        </td>
                                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                        {event.organizer && (
                                                            <div className="flex items-center gap-2">
                                                            <ParticipantAvatar nom={event.organizer.emailAddress.name} type="organizer"  />
                                                            
                                                            </div>
                                                        )}
                                                        </td>

                                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            {event.attendees && event.attendees.length > 0 ? (
                                                                <div className="flex flex-col">
                                                                    {/* <span>{event.attendees.length} participant(s)</span> */}
                                                                    <div className="flex -ml-2 mt-1">
                                                                        {event.attendees
                                                                            .filter(a => a.emailAddress.address !== event.organizer?.emailAddress.address) 
                                                                            .slice(0, 3)
                                                                            .map((attendee, index) => (
                                                                            <div key={index} className="relative group -ml-2 first:ml-0">
                                                                                <p className="text-xs border relative bg-cyan-100 text-cyan-600 border-cyan-300 p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700">
                                                                                    {getThreeInitials(attendee.emailAddress.name)}
                                                                                </p>
                                                                                <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999 top-[-35px] left-1/2 transform -translate-x-1/2">
                                                                                    <p>{attendee.emailAddress.name}</p>
                                                                                    {/* <p className="text-xs">{attendee.status?.time}</p> */}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        {event.attendees.filter(a => 
                                                                                a.emailAddress.address !== event.organizer?.emailAddress.address
                                                                            ).length > 3 && (
                                                                            <div className="relative group -ml-2 first:ml-0">
                                                                                <p className="text-xs border relative bg-cyan-100 text-cyan-600 border-cyan-300 p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700">
                                                                                    +{event.attendees.length - 3}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                'Aucun participant'
                                                            )}
                                                        </td>
                                                        {/* <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            {event.webLink ? (
                                                                <a 
                                                                    href={event.webLink} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                                >
                                                                    Ouvrir dans Outlook
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-500">Aucun lien disponible</span>
                                                            )}
                                                        </td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-4">
                                                        Aucun événement Outlook trouvé
                                                    </td>
                                                </tr>
                                            )
                                        ) : null}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col flex-wrap md:flex-row justify-end px-4 items-center">
                        <PerPageInput
                            entriesPerPage={entriesPerPage}
                            setEntriesPerPage={setEntriesPerPage}
                            setPage={setActualPage}
                        />
                        <Pagination
                            actualPage={actualPage}
                            setActualPage={setActualPage}
                            pageNumbers={pageNumbers}
                        />
                    </div>
                </>
            </div>
        </DefaultLayout>
    );
};

export default Planification;