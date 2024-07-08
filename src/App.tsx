import useScrollToTop from "hooks/useScrollToTop";
import Login from "pages/Auth/Login";
import ForgotPassword from "pages/Auth/ForgotPassword";
import ChangePassword from "pages/Auth/ChangePassword";
import ProtectedPage from "pages/protectedPages/ProtectedPage";
import { Route, useLocation, Routes, Navigate } from "react-router-dom";
import getRoutes from "./routes";
import { useAppSelector } from "hooks/useStore";
import { authSelector } from "store/auth/authSlice";

function App() {
  const routes = getRoutes();
  const location = useLocation();
  useScrollToTop(location);

  const { access_token } = useAppSelector(authSelector);

  const token = access_token;

  return (
    <div className="text-[#4e4e4e] bg-[hsl(0,0%,98%)] h-screen dark:bg-[hsl(20,14.3%,4.1%)] dark:text-white">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* <Route path="/" element={<ProtectedPage />}>
        
          <Route path="dashboard" element={<Dashboard />} />
        </Route> */}
        <Route
          path="/"
          element={token ? <ProtectedPage /> : <Navigate to="/login" />}
        >
          {routes.map(({ path, element, children }) => (
            <Route key={path} path={path} element={element}>
              {children?.map((child: any) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
