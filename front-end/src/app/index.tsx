import { FC } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AppProvider } from "../providers";
import {
  NotFoundPage,
  PartManagementPage,
  UnderConstructionPage,
} from "@/pages";
import { AppLayout } from "@/layouts/app";

const AppRoutes: FC = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path='/' element={<Navigate to={"/part-management"} />} />
      <Route element={<AppLayout />}>
        <Route path='/part-management' element={<PartManagementPage />} />
        <Route path='/report' element={<UnderConstructionPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export const App: FC = () => (
  <BrowserRouter>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);
