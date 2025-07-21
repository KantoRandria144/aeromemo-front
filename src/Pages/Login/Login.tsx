

import { useState } from "react";
import fond from "../../../src/assets/DJI_0028.jpg";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/User/AuthServices";

const Login = () => {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await AuthService.login({ email, password });
      // alert(`Bienvenue ${user.name}`);
      navigate("/aeromemo/home"); // Redirection vers la page d'accueil
    } catch (err) {
      alert("Échec de la connexion");
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
          <span className="">Admin</span>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Mail"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-[320px] h-[40px] mt-5 bg-transparent border-b-2 text-white text-lg pl-1 focus:outline-none"
            />
            <span >
              
            </span>
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-[320px] h-[40px] mt-5 bg-transparent border-b-2  text-white text-lg pl-1 focus:outline-none"
                
             
            />
            <span
             
            >
             
            </span>
          </div>
          <button
           
            className="w-[320px] flex justify-center items-center h-[35px] mt-10 bg-red-400 text-white text-base font-roboto rounded-sm shadow-md  transition-colors duration-300  
             
                bg-red-500
                  cursor-pointer hover:bg-white hover:text-red-400"
            
           
          >
           
            Se connecter
          </button>
         
        </form>
        <div className="mt-4">
      <span className="text-white">
        Vous n'avez pas encore un compte ?{" "}
        <Link to="/" className="text-red-400 underline hover:text-white">
          S'inscrire
        </Link>
      </span>
    </div>
      </div>
    </div>
  );
};

export default Login;
