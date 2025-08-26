import { SimpleUser } from "../types/user";

// services/OutlookRedirectService.ts
export interface OutlookRedirectParams {
  reunionId: string;
  reunionTitle: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  participants: SimpleUser[];
}

/**
 * Crée une URL de redirection vers Outlook avec callback vers l'application
 * après la création de l'événement
 */
export const createOutlookRedirectUrl = (params: OutlookRedirectParams): string => {
  const {
    reunionId,
    reunionTitle,
    location,
    startDate,
    startTime,
    endDate,
    endTime,
    participants
  } = params;

  // Format des dates pour Outlook
  const startDateTime = `${startDate}T${startTime}`;
  const endDateTime = `${endDate}T${endTime}`;

  // Emails des participants
  const attendeeEmails = participants
    .filter(user => user.email)
    .map(user => user.email)
    .join(';');

  // URL de callback vers votre application
  const callbackUrl = `${window.location.origin}/outlook-callback?` +
    `reunionId=${encodeURIComponent(reunionId)}&` +
    `action=eventCreated&` +
    `source=outlook&` +
    `timestamp=${Date.now()}`;

  // Construction de l'URL Outlook avec redirection
  const outlookParams = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: startDateTime,
    enddt: endDateTime,
    subject: reunionTitle,
    location: location,
    body: `Réunion créée via AeroMemo\n\n` +
          `Retour à l'application: ${callbackUrl}`,
    ...(attendeeEmails && { attendees: attendeeEmails }),
    
    // Paramètres pour la redirection après sauvegarde
    returnto: callbackUrl,
    success: 'true'
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;
};

/**
 * Vérifie si la redirection vient d'Outlook et traite le résultat
 */
export const handleOutlookCallback = (): { 
  success: boolean; 
  reunionId?: string; 
  error?: string 
} => {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  const reunionId = urlParams.get('reunionId');
  const source = urlParams.get('source');
  const success = urlParams.get('success');

  if (source === 'outlook' && action === 'eventCreated') {
    if (success === 'true' && reunionId) {
      return { success: true, reunionId };
    } else {
      return { 
        success: false, 
        error: urlParams.get('error') || 'Erreur lors de la création Outlook' 
      };
    }
  }

  return { success: false };
};

/**
 * Ouvre Outlook dans un nouvel onglet et surveille la redirection
 */
export const openOutlookWithRedirect = (
  outlookUrl: string,
  onSuccess?: (reunionId: string) => void,
  onError?: (error: string) => void,
  onClose?: () => void
): Window | null => {
  const newWindow = window.open(outlookUrl, '_blank', 'width=1000,height=700');

  if (newWindow) {
    // Vérifier périodiquement si la fenêtre est fermée
    const checkInterval = setInterval(() => {
      try {
        if (newWindow.closed) {
          clearInterval(checkInterval);
          onClose?.();
        }
      } catch (error) {
        // Ignorer les erreurs cross-origin
        clearInterval(checkInterval);
      }
    }, 1000);

    // Écouter les messages postMessage (alternative)
    const messageHandler = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data.type === 'outlookEventCreated') {
        onSuccess?.(event.data.reunionId);
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);

    return newWindow;
  }

  return null;
};