import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = (allowedRoles: any) => {
  const { auth } = useAuth();
  const location = useLocation();
  const storeLoggedIn = localStorage.getItem('login');

  return (

    <>
      {(auth.isLoggedIn || storeLoggedIn  == 'true') ? <Outlet /> : <Navigate to="/login" replace />}
    </>
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    // ? <Outlet />
    // : auth?.user
    //     ? <Navigate to="/users" state={{ from: location }} replace />
    //     : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
