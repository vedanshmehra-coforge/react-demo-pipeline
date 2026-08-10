import { Outlet } from 'react-router-dom';
import { APP_NAME, ORGANIZATION } from '@shared/constants/app.constants';

export const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a2238] to-[#0f172a] flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-sm font-bold">NHAI</span>
        </div>
        <h1 className="text-white text-xl font-bold">{ORGANIZATION}</h1>
        <p className="text-cyan-400 text-sm font-semibold mt-1">{APP_NAME}</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <Outlet />
      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} National Highways Authority of India. All rights reserved.
      </p>
    </div>
  </div>
);
