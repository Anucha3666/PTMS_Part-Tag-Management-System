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
  SettingAccountsPage,
  SettingProfilePage,
  SettingsPage,
  UnderConstructionPage,
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
        <Route path='/part' element={<PartManagementPage />} />
        <Route path='/report'>
          <Route index element={<Navigate to={"/report/printed"} />} />
          <Route path='printed' element={<UnderConstructionPage />} />
          <Route path='tag' element={<UnderConstructionPage />} />
        </Route>
        <Route path='/setting'>
          <Route index element={<SettingsPage />} />
          <Route path='profile' element={<SettingProfilePage />} />
          <Route path='account' element={<SettingAccountsPage />} />
        </Route>
      </Route>

      <Route path='/:tag_id' element={<ViewPartPage />} />
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
