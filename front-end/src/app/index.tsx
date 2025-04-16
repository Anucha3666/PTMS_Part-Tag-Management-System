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
  SettingProfilePage,
  SettingsPage,
  TagPage,
  UnderConstructionPage,
} from "@/pages";
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
          <Route path='process' element={<UnderConstructionPage />} />
          <Route path='customers' element={<UnderConstructionPage />} />
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
