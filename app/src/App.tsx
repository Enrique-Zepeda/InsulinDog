import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/AppRouter";
import { useAuthSession } from "./features/auth/hooks/useAuthSession";

function App() {
  useAuthSession();
  return <RouterProvider router={router} />;
}

export default App;
