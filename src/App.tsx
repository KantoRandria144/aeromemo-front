import { Route, Routes } from "react-router-dom";
import "./App.css";
import PageTitle from "./components/PageTitle";
import Accueil from "./Pages/Home/Accueil";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";
import CreateReunion from "./Pages/Reunion/CreateReunion";
import Planification from "./Pages/Reunion/Planification/Planification";
import ManageAccess from "./Pages/Admin/ManageAccess";
import Login from "./Pages/Login/Login";
import { SetStateAction, useEffect, useState } from "react";
import DetailsReunion from "./Pages/Reunion/DetailsReunion";
import { IDecodedToken } from "./types/user";
import { decodeToken } from "./services/Function/TokenService";
import OutlookEvents from "./Pages/Reunion/Planification/OutlookEvents";
import OutlookEventsList from "./Pages/Reunion/Planification/OutlookEventsList";
import EditReunion from "./Pages/Reunion/EditReunion";
import PresencePage from "./Pages/Reunion/PresencePage";


const App = () => {
   const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
     useEffect(() => {
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
    <>
      <Routes>
        <Route 
          index
          element={
            <>
              <PageTitle title="Login" />
              <Login />
            </>
          }
        />
        {/* <Route
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
        /> */}
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
          path="/aeromemo/admin/access"
          element={
            <>
              <PageTitle title="Admin"/>
              <ManageAccess/>
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
          path="/aeromemo/reunion/modification/:id"
          element={<EditReunion />}
        />
        <Route 
          path="/aeromemo/reunion/:id" 
          element={<DetailsReunion />} 
        />
         <Route 
          path="/aeromemo/reunion/outlook" 
          element={<OutlookEventsList />} 
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
        <Route 
          path="/presence/:qrCodeId"
          element={
            <>
              <PageTitle  title="Présence"/>
              <PresencePage/>
            </>
          }
        />

       
      </Routes>
    </>
  );
};

export default App;
