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
      watchAllActivity: false,
    },
    project: {
      assign: false,
      create: false,
      delete: false,
      update: false,
      watchMyProject: false,
      watchMySubordinatesProject: false,
      watchAllProject: false,
      updateMySubordinatesProject: false,
      updateAllProject: false,
      deleteMySubordinatesProject: false,
      deleteAllProject: false,
      manageMySubordinatesProject: false,
      manage: false,
    },
    transverse: {
      create: false,
      update: false,
      delete: false,
    },
    intercontract: {
      create: false,
      update: false,
      delete: false,
    },
  };
  habilitations.forEach(
    ({
      habilitationAdmins,
      habilitationProjects,
      habilitationTransverses,
      habilitationIntercontract,
    }) => {
      const admin = habilitationAdmins?.[0];
      const project = habilitationProjects?.[0];
      const transverse = habilitationTransverses?.[0];
      const intercontract = habilitationIntercontract?.[0];

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
        habilitation.admin.watchAllActivity ||= admin.watchAllActivity === 1;
      }

      // Project habilitations: Same logic as admin
      if (project) {
        habilitation.project.watchMyProject ||= project.watchMyProject === 1;
        habilitation.project.watchMySubordinatesProject ||=
          project.watchMySubordinatesProject === 1;
        habilitation.project.watchAllProject ||= project.watchAllProject === 1;
        habilitation.project.create ||= project.create === 1;
        habilitation.project.update ||= project.update === 1;
        habilitation.project.updateAllProject ||=
          project.updateAllProject === 1;
        habilitation.project.updateMySubordinatesProject ||=
          project.updateMySubordinatesProject === 1;
        habilitation.project.delete ||= project.delete === 1;
        habilitation.project.deleteAllProject ||=
          project.deleteAllProject === 1;
        habilitation.project.deleteMySubordinatesProject ||=
          project.deleteMySubordinatesProject === 1;
        habilitation.project.manageMySubordinatesProject ||=
          project.manageMySubordinatesProject === 1;
        habilitation.project.manage ||= project.manage === 1;
        habilitation.project.assign ||= project.assign === 1;
      }
      if (transverse) {
        habilitation.transverse.create ||= transverse.create === 1;
        habilitation.transverse.update ||= transverse.update === 1;
        habilitation.transverse.delete ||= transverse.delete === 1;
      }
      if (intercontract) {
        habilitation.intercontract.create ||= intercontract.create === 1;
        habilitation.intercontract.update ||= intercontract.update === 1;
        habilitation.intercontract.delete ||= intercontract.delete === 1;
      }
    }
  );
  return habilitation;
};
