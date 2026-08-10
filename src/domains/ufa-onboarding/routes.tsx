import { Routes, Route } from 'react-router-dom';
import { UfaOnboardingListPage } from './pages/ufa-onboarding-list.page';
import { UfaOnboardingDetailPage } from './pages/ufa-onboarding-detail.page';
import { UfaOnboardingCreatePage } from './pages/ufa-onboarding-create.page';

export default function UfaOnboardingRoutes() {
  return (
    <Routes>
      <Route index element={<UfaOnboardingListPage />} />
      <Route path="create" element={<UfaOnboardingCreatePage />} />
      <Route path=":id" element={<UfaOnboardingDetailPage />} />
    </Routes>
  );
}
