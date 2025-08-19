export interface TableAccessProps {
  data: Array<{
    id: string;
    label: string;
    habilitationAdmins: {
      createHabilitation: number;
      deleteHabilitation: number;
      updateHabilitation: number;
      modifyHierarchy: number;
      restoreHierarchy: number;
      actualizeUserData: number;
      assignAccess: number;
      watchAllActivity: number;
    }[];
    habilitationReunion: {
      assign: number;
      create: number;
      update: number;
      updateMySubordinatesReunion: number;
      updateAllReunion: number;
      delete: number;
      deleteMySubordinatesReunion: number;
      deleteAllReunion: number;
      watchMyReunion: number;
      watchAllReunion: number;
      watchMySubordinatesReunion: number;
      manage: number;
      manageMySubordinatesReunion: number;
    }[];
  }>;
}
