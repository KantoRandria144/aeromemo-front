import { getUserHabilitations } from "../User/UserServices";
import { decodeToken } from "./TokenService";



export const getInitials = (fullname: string) => {
  const names = fullname?.split(" ");
  const firstInitial = names?.[0] ? names?.[0]?.[0]?.toUpperCase() : "";
  const secondInitial = names?.[1] ? names?.[1]?.[0]?.toUpperCase() : "";

  return `${firstInitial}${secondInitial}`;
};

//prendre les trois initials des noms
export const getThreeInitials = (fullname: string) => {
  const names = fullname
    .split(" ")
    .filter(name => name.length > 0 && !name.startsWith("(")); // Ignore les parenthèses
  
  const initials = names.map(name => name[0].toUpperCase());

  return initials.slice(0, 3).join('');
};


export const getAllMyHabilitation = async () => {
  const token = localStorage.getItem("_au_pr");
  if (token) {
    try {
      const decoded = decodeToken("pr");

      if (decoded?.jti) {
        const habilitation = await getUserHabilitations(decoded?.jti);
        

        const transformed = transformHabilitation(habilitation.habilitations);

        return transformed;
      }
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }
};

const transformHabilitation = (habilitations: any[]) => {
  const habilitation = {
    admin: {
      createHabilitation: false,
      deleteHabilitation: false,
      modifyHierarchy: false,
      restoreHierarchy: false,
      updateHabilitation: false,
      actualizeUserData: false,
      assignAccess: false,
    },
    reunion: {
      assign: false,
      create: false,
      delete: false,
      update: false,
      watchMyReunion: false,
      watchMySubordinatesReunion: false,
      watchAllReunion: false,
      updateMySubordinatesReunion: false,
      updateAllReunion: false,
      deleteMySubordinatesReunion: false,
      deleteAllReunion: false,
      manageMySubordinatesReunion: false,
      manage: false,
    },
    
  };
  habilitations.forEach(
    ({
      habilitationAdmins,
      habilitationReunions,
     
    }) => {
      const admin = habilitationAdmins?.[0];
      const reunion = habilitationReunions?.[0];
      

      // Admin habilitations: Only update if current value is false and new value is true (1)
      if (admin) {
        habilitation.admin.createHabilitation ||=
          admin.createHabilitation === 1;
        habilitation.admin.deleteHabilitation ||=
          admin.deleteHabilitation === 1;
        habilitation.admin.modifyHierarchy ||= admin.modifyHierarchy === 1;
        habilitation.admin.restoreHierarchy ||= admin.restoreHierarchy === 1;
        habilitation.admin.updateHabilitation ||=
          admin.updateHabilitation === 1;
        habilitation.admin.actualizeUserData ||= admin.actualizeUserData === 1;
        habilitation.admin.assignAccess ||= admin.assignAccess === 1;
      }

      // Reunion habilitations: Same logic as admin
      if (reunion) {
        habilitation.reunion.watchMyReunion ||= reunion.watchMyReunion === 1;
        habilitation.reunion.watchMySubordinatesReunion ||=
          reunion.watchMySubordinatesReunion === 1;
        habilitation.reunion.watchAllReunion ||= reunion.watchAllReunion === 1;
        habilitation.reunion.create ||= reunion.create === 1;
        habilitation.reunion.update ||= reunion.update === 1;
        habilitation.reunion.updateAllReunion ||=
          reunion.updateAllReunion === 1;
        habilitation.reunion.updateMySubordinatesReunion ||=
          reunion.updateMySubordinatesReunion === 1;
        habilitation.reunion.delete ||= reunion.delete === 1;
        habilitation.reunion.deleteAllReunion ||=
          reunion.deleteAllReunion === 1;
        habilitation.reunion.deleteMySubordinatesReunion ||=
          reunion.deleteMySubordinatesReunion === 1;
        habilitation.reunion.manageMySubordinatesReunion ||=
          reunion.manageMySubordinatesReunion === 1;
        habilitation.reunion.manage ||= reunion.manage === 1;
        habilitation.reunion.assign ||= reunion.assign === 1;
      }
     
    }
  );
  return habilitation;
};
