import { UserProvider } from "./contexts/UserContext.jsx";
import { MP3Provider } from "./contexts/MP3Context.jsx";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import PageFallback from "./components/PageFallback.jsx";
const Header = lazy(() => import("./components/Header.jsx"));

const EditProfile = lazy(() => import("./pages/EditAccount.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.jsx"));
const Credits = lazy(() => import("./pages/Credits.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const BugReport = lazy(() => import("./pages/BugReport.jsx"));
// const ConvertedMusic = lazy(() => import("./pages/DisplayMusic.jsx"));
const MP3Player = lazy(() => import("./components/MP3Player.jsx"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <MP3Provider>
          <Header />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route exact path="/YotuTube-Convert2MP3/account" element={<ProtectedRoute element={<Account />} />} />
              <Route
                exact
                path="/YotuTube-Convert2MP3/music-list"
                element={<ProtectedRoute element={<MP3Player />} />}
              />
              <Route
                exact
                path="/YotuTube-Convert2MP3/account/edit"
                element={<ProtectedRoute element={<EditProfile />} />}
              />
              <Route
                exact
                path="/YotuTube-Convert2MP3/bug-report"
                element={<ProtectedRoute element={<BugReport />} />}
              />
              <Route exact index path="/YotuTube-Convert2MP3/" element={<App />} />
              <Route exact path="/YotuTube-Convert2MP3/signin" element={<Signin />} />
              <Route exact path="/YotuTube-Convert2MP3/login" element={<Login />} />
              <Route exact path="/YotuTube-Convert2MP3/credits" element={<Credits />} />
              <Route exact path="/YotuTube-Convert2MP3/reset-password" element={<ForgotPassword />} />
              <Route exact path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </MP3Provider>
      </UserProvider>
    </Router>
  </React.StrictMode>
);
