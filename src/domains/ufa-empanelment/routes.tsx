import { Routes, Route } from 'react-router-dom';
import { UfaEmpanelmentListPage } from './pages/ufa-empanelment-list.page';
import { UfaEmpanelmentDetailPage } from './pages/ufa-empanelment-detail.page';

export default function UfaEmpanelmentRoutes() {
  return (
    <Routes>
      <Route index element={<UfaEmpanelmentListPage />} />
      <Route path=":id" element={<UfaEmpanelmentDetailPage />} />
    </Routes>
  );
}
