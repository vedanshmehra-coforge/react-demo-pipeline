import { Routes, Route } from 'react-router-dom';
import { TollPbgListPage } from './pages/toll-pbg-list.page';
import { TollPbgDetailPage } from './pages/toll-pbg-detail.page';

export default function TollPbgRoutes() {
  return (
    <Routes>
      <Route index element={<TollPbgListPage />} />
      <Route path=":id" element={<TollPbgDetailPage />} />
    </Routes>
  );
}
