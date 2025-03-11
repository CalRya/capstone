import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import CourierHome from './components/Pages/Courier/courierHome';
import CourierLibrary from './components/Pages/Courier/courierLibrary';
import CourierHistory from './components/Pages/Courier/courierHistory';
import CourierGamehome from './components/Pages/Courier/courierGamehome';
import CourierProfile from './components/Pages/Courier/courierProfile';
import CourierArticles from './components/Pages/Courier/courierviewPage';

import AdminPage from './components/Pages/ADMIN/AdminPage';
import ManageUsers from './components/Admin/Admin';
import DigiLibAdmin from './components/Pages/ADMIN/DigiLibAdmin';
import LibAdmin from './components/Pages/ADMIN/LibAdmin';
import AboutAdmin from './components/Pages/ADMIN/AboutAdmin';
import ProfAdmin from './components/Pages/ProfAdmin';
import ManageAdmin from './components/Pages/ADMIN/RealAdmin';

const router = createBrowserRouter([
  { path: "/", element: <RegisterApp /> },
  { path: "login", element: <Login /> },
  { path: "home", element: <HomePage /> },
  { path: "lib", element: <LibraryPage /> },
  { path: "gamesh", element: <GameHome /> },
  { path: "prof", element: <Prof /> },
  { path: "contactpage", element: <ContactPage /> },
  { path: "settingsp", element: <SettingsP /> },
  { path: "aboutus", element: <AboutUs /> },
  { path: "courierp", element: <CourierArticles /> },
  { path: "homeadmin", element: <AdminPage /> },
  { path: "manageusers", element: <ManageUsers /> },
  { path: "digilibadmin", element: <DigiLibAdmin /> },
  { path: "libadmin", element: <LibAdmin /> },
  { path: "aboutadmin", element: <AboutAdmin /> },
  { path: "bookhistory", element: <History /> },
  { path: "profadmin", element: <ProfAdmin /> },
  { path: "adminmanage", element: <ManageAdmin /> },
  { path: "courierhome", element: <CourierHome /> },
  { path: "courierlibrary", element: <CourierLibrary /> },
  { path: "courierhistory", element: <CourierHistory /> },
  { path: "couriergamehome", element: <CourierGamehome /> },
  { path: "courierprofile", element: <CourierProfile /> },
  { path: "courierarticles", element: <CourierPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
