import { FC } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AppLayout } from "@/layouts/app";
import {
  LoginPage,
  NotFoundPage,
  PartManagementPage,
  ReportPage,
  SettingsPage,
  ViewPartPage,
} from "@/pages";
import { AppProvider } from "../providers";

const AppRoutes: FC = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path='/' element={<Navigate to={"/login"} />} />
      <Route path='/login' element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path='/part-management' element={<PartManagementPage />} />
        <Route path='/report' element={<ReportPage />} />
        <Route path='/setting' element={<SettingsPage />} />
      </Route>
      <Route path='/:part_id' element={<ViewPartPage />} />

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
