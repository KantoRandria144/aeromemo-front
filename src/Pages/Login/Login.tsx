import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import fond from "../../../src/assets/DJI_0028.jpg";
import { useAuthService } from "../../services/login";

const Login = () => {
  const { loginUser } = useAuthService();
  const [user, setUser] = useState({
    username: "",
    password: "",
    type: "project",
  });
  const [loginError, setLoginError] = useState({
    mail: "",
    password: "",
    error: "",
  });
  useEffect(() => {
    const projectStorage = localStorage.getItem("_au_pr");
    console.log("Valeur de _au_pr dans localStorage :", projectStorage);
    if (projectStorage) {
      navigate("/aeromemo/home");
    }
  }, []);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const loginAnswer = await loginUser(user);
      if (loginAnswer.type === "success") {
        navigate("/aeromemo/home");
      } else if (loginAnswer.type === "unknown_user") {
        setLoginError({ ...loginError, mail: loginAnswer.message });
      } else if (loginAnswer.type === "incorrect_pass") {
        setLoginError({ ...loginError, password: loginAnswer.message });
      } else {
        setLoginError({ ...loginError, error: loginAnswer.message });
      }
    } catch (error) {
      console.error(`error during login`);
    } finally {
      setIsLoginLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center ">
      <div
        className="absolute inset-0 bg-cover bg-center filter  blur-sm"
        style={{ backgroundImage: `url(${fond})` }}
      ></div>
      <div className="relative rounded-lg flex flex-col justify-center items-center h-full w-full md:h-[500px] md:w-[450px]  bg-black bg-opacity-60 p-4 shadow-lg">
        <div className="text-white  text-center  flex flex-col  mb-4">
          <span className="text-6xl">G.M.P</span>
          <span className="text-base">
            <b>G</b>estion et <b>M</b>anagement de <b>P</b>rojet
          </span>
        </div>
        <form className="flex flex-col items-center w-full">
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="Matricule"
              required
              className={`w-[320px] h-[40px] mt-5 bg-transparent border-b-2 text-white text-sm pl-1 focus:outline-none   ${
                loginError.mail === ""
                  ? "focus:border-primaryGreen"
                  : "border-red-500"
              } transition-colors duration-500 ease-in-out`}
              onChange={(e) => {
                setLoginError({
                  ...loginError,
                  mail: "",
                  password: "",
                  error: "",
                });
                setUser({
                  ...user,
                  username: e.target.value,
                });
              }}
            />
            <span
              className={`mt-1 w-[320px]  text-center  text-red-500 text-sm ${
                loginError.mail === "" ? "hidden" : ""
              }`}
            >
              {loginError.mail}
            </span>
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Mot de passe"
              required
              className={`w-[320px] h-[40px] mt-5 bg-transparent border-b-2  text-white text-sm pl-1 focus:outline-none ${
                loginError.password === ""
                  ? "focus:border-primaryGreen"
                  : "border-red-500"
              } transition-colors duration-500 ease-in-out`}
              onChange={(e) => {
                setLoginError({
                  ...loginError,
                  mail: "",
                  password: "",
                  error: "",
                });
                setUser({
                  ...user,
                  password: e.target.value,
                });
              }}
            />
            <span
              className={`mt-1 text-red-500 text-sm ${
                loginError.password === "" ? "hidden" : ""
              }`}
            >
              {loginError.password}
            </span>
          </div>
          <button
            onClick={handleLogin}
            className={`w-[320px] flex justify-center items-center h-[35px] mt-10 bg-red-400 text-white text-base font-roboto rounded-sm shadow-md  transition-colors duration-300  ${
              isLoginLoading
                ? "bg-red-500"
                : "cursor-pointer hover:bg-white hover:text-red-400"
            }`}
            disabled={isLoginLoading}
          >
            {isLoginLoading && (
              <span>
                <PuffLoader size={20} className="mr-2" />
              </span>
            )}
            Se connecter
          </button>
          {loginError.error && (
            <div className="text-red-500 mt-4 font-bold flex flex-col justify-center items-center ">
              <span>Vous n'avez pas accès à cette plateforme,</span>
              <span className=" text-center">
                Veuillez vérifier votre connexion ou contacter l'administrateur
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
