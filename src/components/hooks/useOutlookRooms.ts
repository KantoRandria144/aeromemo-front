// hooks/useOutlookRooms.ts
import { useState, useEffect } from 'react';
import { checkRoomAvailability, getOutlookRooms, OutlookRoom } from '../../services/OutlookRoomService';


export const useOutlookRooms = (accessToken?: string) => {
  const [rooms, setRooms] = useState<OutlookRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const outlookRooms = await getOutlookRooms(accessToken);
      setRooms(outlookRooms);
    } catch (err) {
      setError('Erreur lors de la récupération des salles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (
    roomEmail: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): Promise<boolean> => {
    if (!accessToken) return false;

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    try {
      return await checkRoomAvailability(roomEmail, startDateTime, endDateTime, accessToken);
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
      return false;
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchRooms();
    }
  }, [accessToken]);

  return {
    rooms,
    loading,
    error,
    refreshRooms: fetchRooms,
    checkAvailability
  };
};