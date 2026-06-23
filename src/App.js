import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { BottomNav } from './components/Layout';
import Landing           from './screens/Landing';
import HCPLogin          from './screens/HCPLogin';
import ACSLogin          from './screens/ACSLogin';
import HCPHome           from './screens/HCPHome';
import ACSHome           from './screens/ACSHome';
import HCPIntake         from './screens/HCPIntake';
import ACSIntake         from './screens/ACSIntake';
import Treatment         from './screens/Treatment';
import SevereReferral    from './screens/SevereReferral';
import PediatricReferral from './screens/PediatricReferral';
import Dashboard         from './screens/Dashboard';
import RecursosSalud     from './screens/RecursosSalud';
import RecursosHub       from './screens/RecursosHub';
import PSDashboard       from './screens/PSDashboard';

const NO_NAV = ['/', '/hcp/login', '/acs/login'];

function AppShell({ children }) {
  const { pathname } = useLocation();
  return <>{children}{!NO_NAV.includes(pathname) && <BottomNav />}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/"                   element={<Landing />} />
          <Route path="/hcp/login"          element={<HCPLogin />} />
          <Route path="/acs/login"          element={<ACSLogin />} />
          <Route path="/hcp/home"           element={<HCPHome />} />
          <Route path="/acs/home"           element={<ACSHome />} />
          <Route path="/hcp/intake"         element={<HCPIntake />} />
          <Route path="/acs/intake"         element={<ACSIntake />} />
          <Route path="/treatment"          element={<Treatment />} />
          <Route path="/severe-referral"    element={<SevereReferral />} />
          <Route path="/pediatric-referral" element={<PediatricReferral />} />
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/ps/dashboard"        element={<PSDashboard />} />
          <Route path="/recursos/salud"     element={<RecursosSalud />} />
          <Route path="/recursos/hub"       element={<RecursosHub />} />
          <Route path="*"                   element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
