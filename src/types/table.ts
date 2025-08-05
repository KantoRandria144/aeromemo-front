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
  }>;
}
