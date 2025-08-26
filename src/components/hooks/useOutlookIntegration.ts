// hooks/useOutlookIntegration.ts
import { useState } from 'react';

import { SimpleUser } from '../../types/user';
import { createOutlookRedirectUrl, openOutlookWithRedirect } from '../../services/OutlookRedirectService';


interface UseOutlookIntegrationProps {
  onSuccess?: (reunionId: string) => void;
  onError?: (error: string) => void;
  onWindowClose?: () => void;
}

export const useOutlookIntegration = (props?: UseOutlookIntegrationProps) => {
  const [isOutlookWindowOpen, setIsOutlookWindowOpen] = useState(false);

  const createOutlookEvent = (params: {
    reunionId: string;
    title: string;
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    participants: SimpleUser[];
  }) => {
    const outlookUrl = createOutlookRedirectUrl({
      reunionId: params.reunionId,
      reunionTitle: params.title,
      location: params.location,
      startDate: params.startDate,
      startTime: params.startTime,
      endDate: params.endDate,
      endTime: params.endTime,
      participants: params.participants
    });

    const outlookWindow = openOutlookWithRedirect(
      outlookUrl,
      (reunionId: string) => {
        setIsOutlookWindowOpen(false);
        props?.onSuccess?.(reunionId);
      },
      (error: string) => {
        setIsOutlookWindowOpen(false);
        props?.onError?.(error);
      },
      () => {
        setIsOutlookWindowOpen(false);
        props?.onWindowClose?.();
      }
    );

    if (outlookWindow) {
      setIsOutlookWindowOpen(true);
    }

    return outlookWindow;
  };

  return {
    createOutlookEvent,
    isOutlookWindowOpen,
    setIsOutlookWindowOpen
  };
};