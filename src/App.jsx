import useScrollToTop from "hooks/useScrollToTop";
import ProtectedPage from "pages/protectedPages/ProtectedPage";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  useScrollToTop(location);
  return (
    <div className=" bg-[hsl(0,0%,98%)] dark:bg-[hsl(20,14.3%,4.1%)]">
      <ProtectedPage />
    </div>
  );
}

export default App;
