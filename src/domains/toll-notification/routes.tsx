import { Routes, Route } from 'react-router-dom';
import { TollNotificationListPage }     from './pages/toll-notification-list.page';
import { TollNotificationCreatePage }   from './pages/toll-notification-create.page';
import { TollNotificationDetailPage }   from './pages/toll-notification-detail.page';
import { TollNotificationEditPage }     from './pages/toll-notification-edit.page';
import { TollNotificationSoNumberPage } from './pages/toll-notification-so-number.page';

export default function TollNotificationRoutes() {
  return (
    <Routes>
      <Route index           element={<TollNotificationListPage />} />
      <Route path="create"   element={<TollNotificationCreatePage />} />
      <Route path=":id"      element={<TollNotificationDetailPage />} />
      <Route path=":id/edit" element={<TollNotificationEditPage />} />
      <Route path=":id/so-number" element={<TollNotificationSoNumberPage />} />
    </Routes>
  );
}
