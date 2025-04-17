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
  ComparisonPage,
  LoginPage,
  NotFoundPage,
  PartPage,
  ReportPrintedPage,
  ReportTagPage,
  SettingAccountsPage,
  SettingPartsPage,
  SettingProcessesPage,
  SettingProfilePage,
  SettingsPage,
  TagPage,
} from "@/pages";
import { SettingCustomersPage } from "@/pages/settings/customers";
import { AppProvider } from "../providers";

const AppRoutes: FC = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path='/' element={<Navigate to={"/login"} />} />
      <Route path='/login' element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path='/parts' element={<PartPage />} />
        <Route path='/compare' element={<ComparisonPage />} />
        <Route path='/reports'>
          <Route index element={<Navigate to={"/reports/printed"} />} />
          <Route path='printed' element={<ReportPrintedPage />} />
          <Route path='tags' element={<ReportTagPage />} />
        </Route>
        <Route path='/settings'>
          <Route index element={<SettingsPage />} />
          <Route path='profile' element={<SettingProfilePage />} />
          <Route path='accounts' element={<SettingAccountsPage />} />
          <Route path='processes' element={<SettingProcessesPage />} />
          <Route path='customers' element={<SettingCustomersPage />} />
          <Route path='parts' element={<SettingPartsPage />} />
        </Route>
      </Route>

      <Route path='/tag/:tag_no/:tag_id' element={<TagPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export const App: FC = () => (
  <BrowserRouter basename='ptms'>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);
