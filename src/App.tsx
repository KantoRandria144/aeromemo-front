import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import PageTitle from "./components/PageTitle";
import Register from "./Pages/Login/Register";
import Accueil from "./Pages/Home/Accueil";
import ManageUser from "./Pages/Admin/ManageUser";
import ManageHierarchie from "./Pages/Admin/ManageHierarchie";


const App = () => {
  return (
    <>
      <Routes>
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
