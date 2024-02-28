import Header from "components/shared/Header";
import { Button } from "components/ui/button";
import ProtectedPage from "pages/protectedPages/ProtectedPage";

function App() {
  return (
    <div className=" bg-[hsl(0,0%,99%)] dark:bg-[hsl(20,14.3%,4.1%)]">
      <ProtectedPage />
    </div>
  );
}

export default App;
