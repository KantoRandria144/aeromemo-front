// components/OutlookCallbackHandler.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import { handleOutlookCallback } from '../../services/OutlookRedirectService';


const notyf = new Notyf();

export const OutlookCallbackHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const result = handleOutlookCallback();

    if (result.success && result.reunionId) {
      notyf.success('Événement créé dans Outlook avec succès !');
      
      // Redirection vers la page de détails
      navigate(`/aeromemo/planification/details/${result.reunionId}`, {
        replace: true
      });
    } else if (!result.success) {
      notyf.error(result.error || 'Erreur lors de la création Outlook');
      
      // Redirection vers la page de création avec erreur
      navigate('/aeromemo/planification/create', {
        replace: true,
        state: { outlookError: result.error }
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Traitement de la réponse Outlook...</p>
      </div>
    </div>
  );
};