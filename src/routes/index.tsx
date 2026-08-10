import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@layouts/dashboard-layout/dashboard-layout';
import { AuthLayout } from '@layouts/auth-layout/auth-layout';
import { ProtectedRoute } from './protected-route';
import { PageLoader } from '@shared/components/feedback/page-loader';
import { ROUTES } from '@shared/constants/routes';

// Auth pages (small — no lazy loading needed)
import { LoginPage } from '@pages/auth/login.page';

// Dashboard
import LandingPage from '@pages/landingpage/landingpage';

// Domain routes — lazy loaded (each becomes its own chunk)
const TollMasterRoutes       = lazy(() => import('@domains/toll-master/routes'));
const TollNotificationRoutes = lazy(() => import('@domains/toll-notification/routes'));
const UfaEmpanelmentRoutes   = lazy(() => import('@domains/ufa-empanelment/routes'));
const UfaOnboardingRoutes    = lazy(() => import('@domains/ufa-onboarding/routes'));
const TollBidRoutes          = lazy(() => import('@domains/toll-bid-management/routes'));
const ForceMajeureRoutes     = lazy(() => import('@domains/force-majeure-claim/routes'));
const TollRemittanceRoutes   = lazy(() => import('@domains/toll-remittance/routes'));
const TollPbgRoutes          = lazy(() => import('@domains/toll-pbg/routes'));
const TollGrievanceRoutes    = lazy(() => import('@domains/toll-grievance/routes'));

const wrap = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
    ],
  },

  // Protected app routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Dashboard home
          { path: ROUTES.DASHBOARD, element: <LandingPage /> },

          // Domain routes
          { path: 'toll-master/*',        element: wrap(<TollMasterRoutes />) },
          { path: 'toll-notifications/*', element: wrap(<TollNotificationRoutes />) },
          { path: 'ufa-empanelment/*',    element: wrap(<UfaEmpanelmentRoutes />) },
          { path: 'ufa-onboarding/*',     element: wrap(<UfaOnboardingRoutes />) },
          { path: 'toll-bid/*',           element: wrap(<TollBidRoutes />) },
          { path: 'force-majeure/*',      element: wrap(<ForceMajeureRoutes />) },
          { path: 'toll-remittance/*',    element: wrap(<TollRemittanceRoutes />) },
          { path: 'toll-pbg/*',           element: wrap(<TollPbgRoutes />) },
          { path: 'toll-grievance/*',     element: wrap(<TollGrievanceRoutes />) },

          // Root redirect
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        ],
      },
    ],
  },

  // Error pages
  { path: ROUTES.FORBIDDEN, element: <div className="flex items-center justify-center h-screen text-gray-600 text-lg">403 — Access Denied</div> },
  { path: ROUTES.NOT_FOUND, element: <div className="flex items-center justify-center h-screen text-gray-600 text-lg">404 — Page Not Found</div> },
  { path: '*', element: <Navigate to={ROUTES.NOT_FOUND} replace /> },
]);
