export interface HabilitationDataProps {
  id?: string;
  label: string;
  habilitationAdmins: HabilitationAdminInterface[];
}

export interface HabilitationReunionInterface {
  create: number;
  update: number;
  delete: number;
  assign: number;
}

export interface HabilitationAdminInterface {
  modifyHierarchy: number;
  createHabilitation: number;
  updateHabilitation: number;
  deleteHabilitation: number;
  restoreHierarchy: number;
  actualizeUserData: number;
  assignAccess: number;
  watchAllActivity: number
}

export interface IMyHabilitation {
  admin: {
    createHabilitation: boolean;
    deleteHabilitation: boolean;
    modifyHierarchy: boolean;
    restoreHierarchy: boolean;
    updateHabilitation: boolean;
    actualizeUserData: boolean;
    assignAccess: boolean;
    
  };
 
}
