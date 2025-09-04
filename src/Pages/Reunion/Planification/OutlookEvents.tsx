import { useEffect, useState } from "react";
import { getOutlookEvents } from "../../../services/Reunion/ReunionServices";


const OutlookEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await getOutlookEvents();
        setEvents(result);
      } catch (err) {
        console.error("Erreur lors du chargement des événements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Chargement des événements...</p>;

  return (
    <div>
      <h2 className="text-lg font-bold">Événements Outlook</h2>
      <ul>
        {events.map((event, index) => (
          <li key={event.id || index}>
            <strong>{event.subject}</strong> - {event.start?.dateTime} → {event.end?.dateTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutlookEvents;
