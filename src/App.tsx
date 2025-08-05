import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import PageTitle from "./components/PageTitle";
import Register from "./Pages/Login/Register";
import Accueil from "./Pages/Home/Accueil";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";
import LDAPLogin from "./Pages/Login/LDAPLogin";
import Home from "./Pages/Home/Home";
import CreateReunion from "./Pages/Reunion/CreateReunion";
import Planification from "./Pages/Reunion/Planification/Planification";


const App = () => {
  return (
    <>
      <Routes>
        <Route 
          path="/aeromemo/loginAero"
          element={
            <>
              <LDAPLogin />
            </>
          }
        />
        <Route
          index
          element={
            <>
              <PageTitle title="Register" />
              <Register />
            </>
          }
        ></Route>
        <Route
          path="/aeromemo/login"
          element={
            <>
            <PageTitle title="Login" />
            <Login />
            </>
          }
        />
        <Route 
          path="/aeromemo/home"
          element={
            <>
              <PageTitle title="Accueil"/>
              <Accueil />
            </>
          }
        />
        <Route
          path="/aeromemo/aero-home"
          element={
            <>
            <PageTitle title="Home" />
            <Home/>
            </>
          }
        />
        <Route
          path="/aeromemo/admin/user"
          element={
            <>
              <PageTitle  title="Admin"/> 
              <ManageUser />
            </>
          }
        />
        <Route 
          path="/aeromemo/admin/organigramme"
          element={
            <>
              <PageTitle title="Admin"/>
              <ManageHierarchie />
            </>
          }
        />
        <Route 
          path="/aeromemo/créer-réunion"
          element={
            <>
              <PageTitle title="Réunion" />
              <CreateReunion/>
            </>
          }
        />
        <Route
          path="/aeromemo/planification"
          element={
            <>
              <PageTitle  title="Planification"/>
              <Planification/>
            </>
          }
        />

       
      </Routes>
    </>
  );
};

export default App;
