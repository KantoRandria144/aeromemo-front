import axios from "axios";
import { AssignHabilitationProps } from "../../types/user";


const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// ASIGN HABILITATION TO USER
export const assignHabilitations = async (
  userHabData: AssignHabilitationProps
) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/User/assign-habilitations`,
      userHabData
    );
    console.log(`Habilitations assigned successfully: ${response.data}`);
  } catch (error) {
    console.error(`error service assign habilitation: ${error}`);
  }
};

// ACTUALISE USER DATA
export const actualiseUserData = async () => {
  try {
    const response = await axios.post(`${endPoint}/api/User/Actualize`);
    return response;
  } catch (error) {
    console.error(`Error while actualising user data: ${error}`);
  }
};

/* ======= GET ======= */

// GET ALL USERS
export const getAllUsers = async (
  nameOrMail?: string,
  department?: string,
  habilitation?: string
) => {
  try {
    const params: any = {};
    if (nameOrMail) params.nameOrMail = nameOrMail;
    if (department) params.department = department;
    if (habilitation) params.habilitation = habilitation;

    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${endPoint}/api/User/all?${queryString}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching users`);
  }
};

export const getAllUserPaginated = async (
  pageNumber: number,
  pageSize: number,
  nameOrMail?: string,
  department?: string,
  habilitation?: string
) => {
  try {
    const params: any = {
      pageNumber,
      pageSize,
    };
    if (nameOrMail) params.nameOrMail = nameOrMail;
    if (department) params.department = department;
    if (habilitation) params.habilitation = habilitation;
    const response = await axios.get(`${endPoint}/api/User/all-paginate`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error at getAllUserPaginated services: ${error}`);
  }
};

export const getMySubordinatesNameAndId = async (
  superiorid: string,
  mode?: string
) => {
  try {
    const params: any = {
      pageNumber: 1,
      pageSize: 500,
    };
    const response = mode === 'all' ? 
    await axios.get(`${endPoint}/api/User/all-paginate`, {params})
    : await axios.get(
      `${endPoint}/api/User/subordinates/${superiorid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at getMySubordinatesNameAndId services: ${error}`);
  }
};

// GET ALL DEPARTMENTS
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/User/departments`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching department list`);
  }
};

// get user habiliation
export const getUserHabilitations = async (userId: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/User/habilitation/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching user habilitation list`);
  }
};
