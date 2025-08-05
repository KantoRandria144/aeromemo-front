import { ReactNode, useState, useEffect } from "react";
import NavigateBar from "../Sidebar/NavigateBar";
import { IDecodedToken } from "../../types/user";
import { IMyHabilitation } from "../../types/Habilitation";
import { getAllMyHabilitation } from "../../services/Function/UserFonctionService";
import { decodeToken } from "../../services/Function/TokenService";
import Head from "../Header/Head";

const LDAPLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();

  const getMyHabilitation = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getMyHabilitation();
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
        localStorage.removeItem("_au_pr");
      }
    }
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/*===== PAGE WRAPPER START ===== */}
      <div className="flex h-screen overflow-hidden">
        {/* ===== SIDEBAR START ===== */}
        <NavigateBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}    
        />
        {/* ===== SIDEBAR START END ===== */}

        {/* ===== CONTENT START ===== */}
        <div className="relative bg-whiten dark:bg-black flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* ===== HEADER START ===== */}
          <Head
            sidebarOpen={sidebarOpen}
            userConnected={decodedToken}
            setSidebarOpen={setSidebarOpen}
          />
          {/* ===== HEADER END ===== */}
          {/* ===== MAIN CONTENT START ===== */}
          <main>
            <div className=" w-full">{children}</div>
          </main>
          {/* ===== MAIN CONTENT END ===== */}
        </div>
        {/* ===== CONTENT END ===== */}
      </div>
      {/* ===== PAGE WRAPPER END ===== */}
    </div>
  );
};

export default LDAPLayout;
