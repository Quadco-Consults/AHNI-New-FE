import useScrollToTop from "hooks/useScrollToTop";
import Login from "pages/Auth/Login";
import ProtectedPage from "pages/protectedPages/ProtectedPage";
// Routes removed - using Next.js App Router instead
import { useAppSelector } from "hooks/useStore";
import { authSelector } from "store/auth/authSlice";
import ForgotPassword from "pages/Auth/ForgotPassword";
import ChangePassword from "pages/Auth/ChangePassword";
import VerifyOTP from "pages/Auth/VerifyOTP";

function App() {
    // const routes = getRoutes(); // Removed - using Next.js App Router
    const pathname = usePathname();
    useScrollToTop(location);

    const { access_token } = useAppSelector(authSelector);

    const token = access_token;

    return (
        <div className="text-[#4e4e4e] bg-[hsl(0,0%,98%)] h-screen overflow-auto dark:bg-[hsl(20,14.3%,4.1%)] dark:text-white">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route
                    path="/"
                    element={
                        token ? <ProtectedPage /> : <Navigate href="/login" />
                    }
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
                    element={<Navigate href={token ? "/dashboard" : "/login"} />}
                />
            </Routes>
        </div>
    );
}

export default App;
