import { Routes, Route } from 'react-router-dom';
import { ForceMajeureListPage } from './pages/force-majeure-claim-list.page';
import { ForceMajeureDetailPage } from './pages/force-majeure-claim-detail.page';

export default function ForceMajeureRoutes() {
  return (
    <Routes>
      <Route index element={<ForceMajeureListPage />} />
      <Route path=":id" element={<ForceMajeureDetailPage />} />
    </Routes>
  );
}
