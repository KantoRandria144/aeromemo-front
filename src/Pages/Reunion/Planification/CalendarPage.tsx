import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type EventType = {
  id: string;
  title: string;
  start: string;
  end?: string;
  ownerId: string;
};

const CalendarPage = () => {
  // Utilisateur connecté (par ex. issu du contexte ou du backend)
  const currentUserId = "u1";

  // Onglet actif ("all" ou "mine")
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  // Liste des événements
  const events: EventType[] = [
    { id: "1", title: "Réunion d'équipe", start: "2025-08-28", ownerId: "u1" },
    { id: "2", title: "Appel client", start: "2025-08-29", ownerId: "u2" },
    { id: "3", title: "Formation interne", start: "2025-08-30", ownerId: "u1" },
  ];

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tous
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "mine" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("mine")}
        >
          Mes événements
        </button>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventDidMount={(info) => {
          // Filtrage côté rendu
          if (activeTab === "mine" && info.event.extendedProps.ownerId !== currentUserId) {
            info.el.style.display = "none";
          }
        }}
      />
    </div>
  );
};

export default CalendarPage;
