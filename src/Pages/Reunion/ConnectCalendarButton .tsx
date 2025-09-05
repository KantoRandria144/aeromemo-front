const ConnectCalendarButton = () => {
  const handleConnect = () => {
    const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
    const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
    const redirectUri = `${import.meta.env.VITE_API_ENDPOINT}/api/auth/callback/microsoft`;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Erreur : Impossible de trouver l'ID de l'utilisateur. Veuillez vous reconnecter.");
      return;
    }

    const state = userId; // ici `userId` est garanti comme string
    const scope = "offline_access Calendars.Read User.Read";

    const authUrl =
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_mode=query` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      style={{
        padding: "10px 20px",
        backgroundColor: "#0078D4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Connecter mon calendrier Outlook
    </button>
  );
};

export default ConnectCalendarButton;
