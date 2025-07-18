import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import PageTitle from "./components/PageTitle";


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
        ></Route>

       
      </Routes>
    </>
  );
};

export default App;
