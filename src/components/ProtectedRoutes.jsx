import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import PageFallback from "./PageFallback";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, loadingUser } = useContext(UserContext);

  if (loadingUser) return <PageFallback />;

  return isLoggedIn ? element : <Navigate to="/YotuTube-Convert2MP3/login" />;
};

export default ProtectedRoute;
