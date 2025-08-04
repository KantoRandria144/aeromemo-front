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

       
      </Routes>
    </>
  );
};

export default App;
