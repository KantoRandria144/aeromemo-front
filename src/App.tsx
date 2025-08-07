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
import { SetStateAction } from "react";


const App = () => {
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
          path="/aeromemo/planification"
          element={
            <>
              <PageTitle  title="Planification"/>
              <Planification search={{
                title: "",
                member: "",
                priority: "",
                criticity: "",
                completionPercentage: "",
                startDate: undefined,
                endDate: undefined
              }} availableUser={[]} selectedUserInput={[]} setSelecteduserInput={function (value: SetStateAction<{ id: string; name: string; email: string; }[]>): void {
                throw new Error("Function not implemented.");
              } } setSearch={function (value: SetStateAction<{ title: string; member: string; priority: string; criticity: string; completionPercentage: string; startDate: string | undefined; endDate: string | undefined; }>): void {
                throw new Error("Function not implemented.");
              } }/>
            </>
          }
        /> 

       
      </Routes>
    </>
  );
};

export default App;
