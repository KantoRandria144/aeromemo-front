import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export interface OutlookEvent {
    id: string;
    subject: string;
    body?: {
        content: string;
        contentType: string;
    };
    bodyPreview?: string;
    organizer?: {
        emailAddress: {
            name: string;
            address: string;
        };
    };
    attendees?: Array<{
        emailAddress: {
            name: string;
            address: string;
        };
        type: string;
        status?: {
            response: string;
            time: string;
        };
    }>;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location?: {
        displayName: string;
    };
    webLink?: string;
}

export const outlookService = {
    async getEvents(): Promise<OutlookEvent[]> {
        try {
            const response = await axios.get(`${endPoint}/api/Outlook/events`);
            return response.data;
        } catch (error) {
            console.error("Erreur récupération événements Outlook:", error);
            throw error;
        }
    },

    async getEventsByDateRange(startDate: string, endDate: string): Promise<OutlookEvent[]> {
        try {
            const response = await axios.get(`${endPoint}/api/Outlook/events`, {
                params: {
                    startDate,
                    endDate
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur récupération événements par date:", error);
            throw error;
        }
    }
};