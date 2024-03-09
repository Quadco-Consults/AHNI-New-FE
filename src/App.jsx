import useScrollToTop from "hooks/useScrollToTop";
import ProtectedPage from "pages/protectedPages/ProtectedPage";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  useScrollToTop(location);
  return (
    <div className="text-[#4e4e4e] bg-[hsl(0,0%,98%)] dark:bg-[hsl(20,14.3%,4.1%)] dark:text-white">
      <ProtectedPage />
    </div>
  );
}

export default App;
