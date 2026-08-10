import { Routes, Route } from 'react-router-dom';
import { TollBidListPage } from './pages/toll-bid-management-list.page';
import { TollBidDetailPage } from './pages/toll-bid-management-detail.page';

export default function TollBidRoutes() {
  return (
    <Routes>
      <Route index element={<TollBidListPage />} />
      <Route path=":id" element={<TollBidDetailPage />} />
    </Routes>
  );
}
