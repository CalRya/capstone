import React from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './components/CSS FOLDER/index.css';
import App from './App';
import RegisterApp from './components/Pages/RegisterPage';
import Login from './components/Pages/LoginPage';
import { AuthProvider } from './components/Login/Context/AuthoProv';

import HomePage from './components/Pages/Homepage';
import LibraryPage from './components/Pages/LibraryPage';
import GameHome from './components/Pages/GameHome';
import Prof from './components/Pages/Prof';
import ContactPage from './components/Pages/Contacts';
import SettingsP from './components/Pages/Settings';
import AboutUs from './components/Pages/AboutPage';
import History from './components/Pages/History';

import CourierPage from './components/Pages/CourierHome';

import AdminPage from './components/Pages/ADMIN/AdminPage';
import ManageUsers from './components/Admin/Admin';
import DigiLibAdmin from './components/Pages/ADMIN/DigiLibAdmin';
import LibAdmin from './components/Pages/ADMIN/LibAdmin'
import AboutAdmin from './components/Pages/ADMIN/AboutAdmin';
import ProfAdmin from './components/Pages/ProfAdmin';
  

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterApp/>,
  },
  {
    path: "login",
    element: <Login/>,
  },

  //STUDENT PAGES
  {
    path: "home",
    element: <HomePage/>,
  },
  {
    path: "lib",
    element: <LibraryPage/>,
  },
  {
    path: "gamesh",
    element: <GameHome/>,
  },
  {
    path: "prof",
    element: <Prof/>,
  },
  {
    path: "contactpage",
    element: <ContactPage/>,
  },

  {
    path: "settingsp",
    element: <SettingsP/>,
  },
  {
    path: "aboutus",
    element: <AboutUs/>,
  },

  // COURIER PAGES
  {
    path: "courierp",
    element: <CourierPage/>,
  },

  // ADMIN PAGES
  
  {
    path: "homeadmin",
    element: <AdminPage/>,
  },

    // LIBRARIAN PAGES
  {
    path: "manageusers",
    element: <ManageUsers/>,
  },
  {
    path: "digilibadmin",
    element: <DigiLibAdmin/>,
  },
  {
    path: "libadmin",
    element: <LibAdmin/>,
  },
  {
    path: "aboutadmin",
    element: <AboutAdmin/>,
  },
  {
    path: "bookhistory",
    element: <History/>,
  }, 
  {
    path: "profadmin",
    element: <ProfAdmin/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);



