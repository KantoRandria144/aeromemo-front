import { useEffect, useState } from "react";
import pattern from "../../../src/assets/pattern.png";
const Header = (props: {
    sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  userConnected: any;
}) => {
    const [userConnected, setUserConnected] = useState({
    name: "",
    email: "",
    userid: "",
  });

  useEffect(() => {
    setUserConnected({
      ...userConnected,
      name: props?.userConnected?.name,
      email: props?.userConnected?.sub,
      userid: props?.userConnected?.jti,
    });
  }, [props.userConnected]);

    return (
        <>
            <header className="sticky top-0 z-999 flex w-full py-2 pr-6 bg-white drop-shadow-1 dark:bg-tertiaryGreen bg-cover bg-no-repeat dark:drop-shadow-none"
                    style={{ backgroundImage: `url(${pattern})` }}>
                <div className="flex flex-grow items-center justify-between px-4  md:px-10 ">
                    <div className="flex items-center gap-2  sm:gap-4">
                        {/* ==============MENU HANBURGER START=================== */}
                            <button 
                            aria-controls="sidebar"
                            onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                            }}
                            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark "
                            >
                                <span className="relative block h-5.5 w-5.5 cursor-pointer">
                                <span className="du-block absolute right-0 h-full w-full">
                                    <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!w-full delay-300"
                                    }`}
                                    ></span>
                                    <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "delay-400 !w-full"
                                    }`}
                                    ></span>
                                    <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!w-full delay-500"
                                    }`}
                                    ></span>
                                </span>
                                <span className="absolute right-0 h-full w-full rotate-45">
                                    <span
                                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!h-0 !delay-[0]"
                                    }`}
                                    ></span>
                                    <span
                                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!h-0 !delay-200"
                                    }`}
                                    ></span>
                                </span>
                                </span>
                            </button>
                        {/* ==============MENU HANBURGER END=================== */}
                    </div>
                </div>
                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        
                    </ul>
                </div>
            </header>
        </>
    )
}

export default Header;