import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getAllMyNotification, updateNotifRead } from "../../services/Reunion/NotificationServices";
import { formatDate } from "../../services/Function/DateServices";
import { IListNotification, INotification } from "../../types/Notification";
import { getNotificationMessage } from "../constants/NotificationMessage";

const NotificationDropDown = ({ userConnected }: { userConnected: any }) => {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [myNotification, setMyNotification] = useState<INotification>();
  const navigate = useNavigate();

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        dropDownOpen &&
        dropdown.current &&
        !dropdown.current.contains(event.target as Node) &&
        trigger.current &&
        !trigger.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    },
    [dropDownOpen]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (dropDownOpen && event.key === "Escape") {
        setDropDownOpen(false);
      }
    },
    [dropDownOpen]
  );

  useEffect(() => {
    if (dropDownOpen) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropDownOpen, handleOutsideClick, handleKeyDown]);

  useEffect(() => {
    if (!userConnected?.userid) {
      console.warn(
        "User ID is not available. Skipping SignalR connection setup."
      );
      return;
    }
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_ENDPOINT}/notificationHub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("connecté à signalR");
      })
      .catch((err) => {
        console.error("Erreur de connextion signalR : ", err);
      });

    connection.on(`ReceiveNotification-${userConnected?.userid}`, () => {
      fetchMyNotification(userConnected?.userid);
    });
    return () => {
      connection.stop();
    };
  }, [userConnected?.userid]);

  const fetchMyNotification = async (userid: string) => {
    try {
      const notifs = await getAllMyNotification(userid, 1, 5);
      setMyNotification(notifs);
    } catch (error) {
      console.error("Error at fetching notification : ", error);
    }
  };
  useEffect(() => {
    if (userConnected?.userid) {
      fetchMyNotification(userConnected.userid);
    }
  }, [userConnected?.userid]);

  const handleChangeReadStateMessage = useCallback(
    async (userid: string, notifid: string) => {
      try {
        await updateNotifRead(userid, notifid);

        setMyNotification((prev) => {
          if (!prev) return prev;

          const notification = prev.listNotification.find(
            (notif) => notif.id === notifid
          );

          if (!notification || notification.isRead) {
            return prev;
          }
          return {
            ...prev,
            listNotification: prev.listNotification.map((notif) =>
              notif.id === notifid ? { ...notif, isRead: true } : notif
            ),
            numberOfNotificationNotRead: Math.max(
              prev.numberOfNotificationNotRead - 1,
              0
            ),
          };
        });
      } catch (error) {
        console.error("Error at update read state message : ", error);
      }
    },
    []
  );

  const navigateToAllNotifications = () => {
    if (userConnected?.userid) {
      navigate(`/gmp/project/notification/${userConnected?.userid}`);
    }
  };
  return (
    <li className="relative">
      <Link
        to="#"
        ref={trigger}
        onClick={(e) => {
          e.preventDefault();
          setDropDownOpen((prev) => !prev);
        }}
        className={`flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-secondaryGreen dark:bg-secondaryGreen dark:text-white`}
      >
        {myNotification?.numberOfNotificationNotRead != undefined &&
          myNotification?.numberOfNotificationNotRead > 0 && (
            <span className="absolute -top-1.5 -right-1 z-1 flex items-center justify-center h-5 w-5 rounded-full bg-meta-1 text-white text-xs font-semibold">
              {myNotification?.numberOfNotificationNotRead}
            </span>
          )}

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
            fill=""
          />
        </svg>
      </Link>
      <div
        ref={dropdown}
        onFocus={() => setDropDownOpen(true)}
        onBlur={() => setDropDownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropDownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Notifications</h5>
        </div>
        <ul className="flex h-auto flex-col overflow-y-auto">
          {myNotification?.listNotification?.map((notif: IListNotification) => {
            const date = formatDate(notif?.modifiedAt, true);

            return (
              <li
                key={notif?.id}
                className="relative"
                onClick={() => {
                  handleChangeReadStateMessage(
                    userConnected?.userid,
                    notif?.id
                  );
                }}
              >
                <div className="flex text-black flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                  <div className="flex items-center gap-2">
                    {/* Indicateur de notification non lue avec animation */}
                    {!notif.isRead && (
                      <span className="absolute left-1 top-4 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                    <p className="text-sm">
                      <span className="text-black dark:text-white">
                        {getNotificationMessage(
                          notif?.title ?? "",
                          notif?.userRoleInProject as
                            | "director"
                            | "member"
                            | "observator",
                          notif?.projectid ?? "",
                          notif.type as
                            | "Create"
                            | "Update"
                            | "Delete"
                            | "Add"
                            | "Archive"
                            | "Warning",
                          notif.table ?? "",
                          notif.subTable ?? "",
                          notif.oldValue,
                          notif.newValue,
                          notif.activityid ?? "",
                          notif?.modifiedBy
                        )}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs">{`${date}`}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div
          className="text-sm p-2 bg-transparent hover:bg-gray-2 hover:text-black dark:hover:text-white transition-colors duration-300 flex justify-center border-t border-stroke dark:border-strokedark dark:hover:bg-meta-4 cursor-pointer"
          onClick={navigateToAllNotifications}
        >
          Voir toutes les notifications
        </div>
      </div>
    </li>
  );
};

export default NotificationDropDown;
