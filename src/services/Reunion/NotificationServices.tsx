import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ======GET========
// get all notification of one user
export const getAllMyNotification = async (
  userid: string,
  pageNumber?: number,
  pageSize?: number
) => {
  try {
    const params: any = {
      pageNumber,
      pageSize,
    };
    const response = await axios.get(`${endPoint}/api/Notification/${userid}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Error at fetching notification by user id service: ${error}`
    );
  }
};

// =======PUT======
// make a notif readed
export const updateNotifRead = async (userid: string, notifid: string) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Notification/read/${notifid}/${userid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update notif read state service: ${error}`);
  }
};
// make all notif readed
export const MakeAllNotifReaded = async (userid: string) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Notification/read-all/${userid}`
    )
    return response.data
  } catch (error) {
    throw new Error(`Error at update all notif read state service: ${error}`);
  }
}