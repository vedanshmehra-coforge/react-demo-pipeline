import { Routes, Route } from 'react-router-dom';
import { TollRemittanceListPage } from './pages/toll-remittance-list.page';
import { TollRemittanceDetailPage } from './pages/toll-remittance-detail.page';

export default function TollRemittanceRoutes() {
  return (
    <Routes>
      <Route index element={<TollRemittanceListPage />} />
      <Route path=":id" element={<TollRemittanceDetailPage />} />
    </Routes>
  );
}
