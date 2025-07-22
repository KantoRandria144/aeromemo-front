import React, { ReactNode, useEffect, useState } from "react";
import NavigateBar from "../Sidebar/NavigateBar";
import Header from "../Header";
import { AuthService } from "../../services/User/AuthServices";

const DefaultLayout: React.FC<{children: ReactNode }> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userConnected, setUserConnected] = useState({
        name: "",
        email: "",
        userid: "",
    });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUserConnected({
          name: user.name,
          email: user.email,
          userid: user.id // or whatever property your AuthResponse has
        });
      } catch (error) {
        console.error("User not connected or session expired");
      }
    };

    fetchUser();
  }, []);

    return (
        <>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                <NavigateBar 
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="relative bg-whiten dark:bg-black flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header 
                        sidebarOpen={sidebarOpen}
                        userConnected={userConnected}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <main>
                      <div className="w-full">{children}</div>
                    </main>
                </div>
            </div>
        </div>
        </>
    )
}

export default DefaultLayout;