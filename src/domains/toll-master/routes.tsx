import { Routes, Route } from 'react-router-dom';
import { TollMasterListPage } from './pages/toll-master-list.page';
import { TollMasterDetailPage } from './pages/toll-master-detail.page';

export default function TollMasterRoutes() {
  return (
    <Routes>
      <Route index element={<TollMasterListPage />} />
      <Route path=":id" element={<TollMasterDetailPage />} />
    </Routes>
  );
}
