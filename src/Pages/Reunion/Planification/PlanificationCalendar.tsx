import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import DefaultLayout from "../../../components/layout/DefaultLayout";
import CustomSelect from "../../../components/UIElements/Select/CustomSelect";
import CustomInput from "../../../components/UIElements/Input/CustomInput";
import { useNavigate } from "react-router-dom";
import { Reunion } from "../../../types/reunion";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { listAllReunion } from "../../../services/Reunion/ReunionServices";

const PlanificationCalendar = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
    const [reunions, setReunions] = useState<Reunion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [collaborateur, setCollaborateur] = useState<string>("");
  const [typeReunion, setTypeReunion] = useState<string>("");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");

    useEffect(() => {
    const fetchReunions = async () => {
      try {
        setLoading(true);
        const data = await listAllReunion();
        setReunions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des réunions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReunions();
  }, []);

  
 const filteredReunions = reunions.filter((r) => {
    if (activeTab === "mine" && !r.isMine) return false;
    if (collaborateur && !r.participants.includes(collaborateur)) return false;
    if (typeReunion && r.type !== typeReunion) return false;
    if (dateDebut && new Date(r.dateDebut) < new Date(dateDebut)) return false;
    if (dateFin && new Date(r.dateFin || r.dateDebut) > new Date(dateFin)) return false;
    return true;
  });

    const events = filteredReunions.map((r) => ({
    id: r.id,
    title: r.titre,
    start: r.dateDebut,
    end: r.dateFin || r.dateDebut,
  }));
    return (
        <>
        <DefaultLayout>
            <div className="mx-2 py-4 md:mx-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <Breadcrumb 
                        paths={[{ name: "Vue calendrier", to: "/aeromemo/planification/calendar" }]}
                    />
                </div>
                <div className="bg-white min-h-[80vh] mt-3 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
                    {/* ================Onglets START========================== */}
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
                            </nav>
                        </div>
                    {/* ================Onglets END========================== */}
                    {/* ================Filters START========================== */}
                     <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full">
                                <CustomSelect
                                    label="Type reunion"
                                    data={["Réunion Transverse", "Réunion Projet"]}
                                    value=""
                                    onValueChange={() => { }}
                                />
                                <CustomInput
                                    type="date"
                                    value={""}
                                    label="Date début"
                                    rounded="medium"
                                />
                                <CustomInput
                                    type="date"
                                    value={""}
                                    label="Date de fin"
                                    rounded="medium"
                                />
                                <div className="flex items-end gap-2 mx-3">
                                    <div className="pb-2">
                                        <button className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit">
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
                                            className="px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2 text-center font-medium text-sm text-white hover:bg-opacity-90 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90 md:ease-in md:duration-300 md:transform"
                                        >
                                            Rechercher
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/* ================Filters END========================== */}
                    <div className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventClick={(info) => {
                navigate(`/aeromemo/reunion/${info.event.id}`);
              }}
              height="80vh"
            />
          </div>
                </div>
            </div>
        </DefaultLayout>
        </>
    )
}

export default PlanificationCalendar;