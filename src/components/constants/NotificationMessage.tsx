export const getNotificationMessage = (
  projectName: string,
  role: "director" | "member" | "observator",
  projectid: string,
  type:
    | "Create"
    | "Update"
    | "Delete"
    | "Add"
    | "Archive"
    | "Warning"
    | "Overdue",
  table: string,
  subTable: string,
  oldValue: string,
  newValue: string,
  activityid: string,
  modifiedBy: string
): JSX.Element => {
  const actions: { [key in "director" | "member" | "observator"]: string } = {
    director: "le gérer",
    member: "voir les détails",
    observator: "suivre son avancement",
  };

  // Générer l'URL en fonction du rôle
  const generateUrl = (
    role: "director" | "member" | "observator",
    projectid: string
  ) => {
    const baseUrl = import.meta.env.VITE_API_FRONT + "/gmp/project";
    if (role === "director") {
      return `${baseUrl}/update/${projectid}`;
    } else {
      return `${baseUrl}/details/${projectid}/details`;
    }
  };

  switch (type) {
    case "Create":
      if (table === "Project") {
        return (
          <>
            Vous avez été ajouté au nouveau projet{" "}
            <strong>"{projectName}"</strong> en tant{" "}
            {role === "director" ? (
              <strong>que Chef de projet</strong>
            ) : role === "member" ? (
              <strong>que Membre</strong>
            ) : (
              <strong>qu'Observateur</strong>
            )}
            .{" "}
            <a
              href={generateUrl(role, projectid)}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour {actions[role]}!
            </a>
          </>
        );
      } else if (table === "Activity") {
        if (subTable === "Task") {
          return (
            <>
              La tâche{" "}
              <i>
                <strong>{newValue}</strong>
              </i>{" "}
              vous a été confiée par <strong>{modifiedBy}</strong> sur le projet{" "}
              <strong>{projectName}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        }
      }
      return <></>;

    case "Update":
      if (table === "UserProject") {
        return (
          <>
            Votre rôle dans le projet <strong>{projectName}</strong> a été
            modifié, vous êtes désormais{" "}
            <strong>
              {role === "director"
                ? "Le Chef de projet"
                : role === "observator"
                ? "un Observateur"
                : "un Membre"}
            </strong>
            .{" "}
            <a
              href={`${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/historic`}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour voir l'historique des modifications!
            </a>
          </>
        );
      } else if (table === "Project") {
        if (subTable === "Advancement") {
          const isCompleted = newValue === "100";
          const link = `${
            import.meta.env.VITE_API_FRONT
          }/gmp/project/details/${projectid}/${
            isCompleted ? "details" : "historic"
          }`;
          return (
            <>
              {isCompleted ? (
                <>
                  Le projet '<strong>{projectName}</strong>' a été{" "}
                  <strong>cloturé</strong>🎉 .
                  <a
                    href={link}
                    className="italic text-xs text-blue-400 hover:text-blue-600"
                  >
                    Cliquez ici pour voir les détails.
                  </a>
                </>
              ) : (
                <>
                  L'avancement du projet '<strong>{projectName}</strong>' a été
                  mis à jour.{" "}
                  <a
                    href={link}
                    className="italic text-xs text-blue-400 hover:text-blue-600"
                  >
                    Consulter l'historique des modifications.
                  </a>
                </>
              )}
            </>
          );
        } else if (subTable === "Status") {
          let stateMessage = "";
          if (newValue === "Stand by") {
        stateMessage = "mis en stand by";
        } 
        else if (newValue === "Archived") {
            stateMessage = "archivé";
        }
        else if (newValue === "Completed") {
            stateMessage = "terminé";
        }
        else if (newValue === "In Progress") {
            stateMessage = "mis en cours";
        }
        else if (newValue === "Not Started") {
            stateMessage = oldValue === "Archived" ? "restauré" : "restitué à l'état 'Pas commencé'";
        }
        else if (newValue !== "Stand by" && newValue !== "Archived" && oldValue === "Stand by") {
            stateMessage = "débloqué";
        }
        else {
            stateMessage = `changé en ${newValue}`;
        }

          return (
            <>
              Le projet <strong>{projectName}</strong> a été{" "}
              <strong>{stateMessage}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/details/${projectid}/details
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        } else if (subTable === "Phase") {
          const projectTitle = projectName.split("/")?.[0];
          const phaseTitle = projectName.split("/")?.[1];
          const state =
            newValue === "Terminé"
              ? "terminée"
              : newValue === "Commencer/En cours"
              ? "maintenant en cours"
              : "en attente de démarrage";
          return (
            <>
              La phase <strong>{phaseTitle}</strong> du projet{" "}
              <strong>{projectTitle}</strong> est <strong>{state}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        }
      } else if (table === "User") {
        return (
          <>
            Vos habilitations sur G.M.P ont été modifié. Vous avez maintenant
            les habilitations en tant que : <strong>{newValue}</strong>.
          </>
        );
      }
      return <></>;

    case "Delete":
      if (table === "UserProject") {
        return (
          <>
            Vous avez été retiré du projet <strong>{projectName}</strong>. Si
            vous avez des questions, contactez le chef de projet.
          </>
        );
      }
      return <></>;
    case "Archive":
      if (table === "Project") {
        return (
          <>
            Le projet <strong>{projectName}</strong> a été archivé.
            <a
              href={`${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/historic
              `}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Consulter l'historique des modifications.
            </a>
          </>
        );
      }
      return <></>;
    case "Warning":
      if (table === "Project") {
        if (subTable === "Phase") {
          const projectTitle = projectName?.split("/")?.[0];
          const phaseTitle = projectName?.split("/")?.[1];
          return (
            <>
              🔔Rappel : La date de fin de la phase{" "}
              <strong>{phaseTitle}</strong> dans le projet{" "}
              <strong>{projectTitle}</strong> est pour demain. Assurez-vous que
              toutes les tâches sont finalisées à temps.
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}`}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir détails.
              </a>
            </>
          );
        } else {
          return (
            <>
              🔔Rappel : La date de fin prévue pour le projet{" "}
              <strong>{projectName}</strong> est demain. Assurez-vous que toutes
              les tâches et les phases sont finalisées à temps.
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/details/${projectid}/details`}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir détails
              </a>
            </>
          );
        }
      }
      return <></>;
    case "Overdue":
      if (table == "Project") {
        if (subTable === "Phase") {
          const projectTitle = projectName?.split("/")?.[0];
          const phaseTitle = projectName?.split("/")?.[1];

          return (
            <>
              ⏳Rappel : la phase <strong>{phaseTitle}</strong> du projet{" "}
              <strong>{projectTitle}</strong> est en retard de{" "}
              <strong>{newValue} jours</strong>.Pensez à terminer les actions en
              cours rapidement !.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}`}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir détails.
              </a>
            </>
          );
        } else {
          return (
            <>
              ⛔Rappel : Le projet <strong>{projectName}</strong> est en retard
              de <strong>{newValue} jours</strong>.Vérifiez la progression et
              ajustez le planning au plus vite.
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/details/${projectid}/details`}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir détails
              </a>
            </>
          );
        }
      }
      return <></>;
    case "Add":
      if (table === "UserProject") {
        return (
          <>
            Vous avez été ajouté au projet <strong>"{projectName}"</strong> en
            tant{" "}
            {role === "director" ? (
              <strong>que Chef de projet</strong>
            ) : role === "member" ? (
              <strong>que Membre</strong>
            ) : (
              <strong>qu'Observateur</strong>
            )}
            .{" "}
            <a
              href={generateUrl(role, projectid)}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour {actions[role]}!
            </a>
          </>
        );
      }
      return <></>;

    default:
      return <></>;
  }
};