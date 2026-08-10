import { Routes, Route } from 'react-router-dom';
import { TollGrievanceListPage } from './pages/toll-grievance-list.page';
import { TollGrievanceDetailPage } from './pages/toll-grievance-detail.page';

export default function TollGrievanceRoutes() {
  return (
    <Routes>
      <Route index element={<TollGrievanceListPage />} />
      <Route path=":id" element={<TollGrievanceDetailPage />} />
    </Routes>
  );
}
