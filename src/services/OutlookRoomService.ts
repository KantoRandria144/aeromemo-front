// services/OutlookRoomService.ts
import axios from 'axios';

const GRAPH_API_ENDPOINT = 'https://graph.microsoft.com/v1.0';

export interface OutlookRoom {
  id: string;
  displayName: string;
  address: string;
  capacity?: number;
  isAvailable?: boolean;
  availabilityStatus?: string;
}

export const getOutlookRooms = async (accessToken: string): Promise<OutlookRoom[]> => {
  try {
    const response = await axios.get(
      `${GRAPH_API_ENDPOINT}/places/microsoft.graph.room`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.value.map((room: any) => ({
      id: room.id,
      displayName: room.displayName,
      address: room.address?.street || room.emailAddress || '',
      capacity: room.capacity,
    }));
  } catch (error) {
    console.error('Erreur récupération salles Outlook:', error);
    throw error;
  }
};

// services/OutlookRoomService.ts
export const getFallbackRooms = (): OutlookRoom[] => {
  return [
    { id: '1', displayName: 'Salle de réunion | DSI', address: 'salle-dsi@entreprise.com', capacity: 8 },
    { id: '2', displayName: 'Salle de réunion | Siège R+4', address: 'salle-r4@entreprise.com' },
    { id: '3', displayName: 'Salle de réunion | Siège R+1', address: 'salle-r1@entreprise.com', capacity: 10 },
  ];
};

export const checkRoomAvailability = async (
  roomEmail: string,
  startDateTime: string,
  endDateTime: string,
  accessToken: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${GRAPH_API_ENDPOINT}/me/findMeetingTimes`,
      {
        attendees: [
          {
            type: 'resource',
            emailAddress: {
              address: roomEmail
            }
          }
        ],
        timeConstraint: {
          timeslots: [
            {
              start: {
                dateTime: startDateTime,
                timeZone: 'UTC'
              },
              end: {
                dateTime: endDateTime,
                timeZone: 'UTC'
              }
            }
          ]
        },
        meetingDuration: 'PT1H'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.emptySuggestionsReason !== 'ResourcesUnavailable';
  } catch (error) {
    console.error('Erreur vérification disponibilité salle:', error);
    return false;
  }
};