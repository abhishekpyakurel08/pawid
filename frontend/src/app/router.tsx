import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

// Pages
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { HowItWorks } from '../pages/HowItWorks';
import { Dogs } from '../pages/Dogs';
import { DogProfile } from '../pages/DogProfile';
import { ReportSighting } from '../pages/ReportSighting';
import { ReportProblem } from '../pages/ReportProblem';
import { CommunityMapPage } from '../pages/CommunityMap';
import { Volunteer } from '../pages/Volunteer';
import { Contact } from '../pages/Contact';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { Login } from '../pages/Login';
import { Gallery } from '../pages/Gallery';

// Protected Dashboard Pages
import { Dashboard } from '../pages/Dashboard';
import { ManageDogs } from '../pages/ManageDogs';
import { RegisterDog } from '../pages/RegisterDog';
import { DogDetails } from '../pages/DogDetails';
import { Reports } from '../pages/Reports';
import { Sightings } from '../pages/Sightings';
import { HealthRecords } from '../pages/HealthRecords';
import { NotFound } from '../pages/NotFound';

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-forest-900 font-bold">Verifying authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'dogs', element: <Dogs /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'map', element: <CommunityMapPage /> },
      { path: 'volunteer', element: <Volunteer /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'login', element: <Login /> },

      // QR Token Scanned Public Views
      { path: 'd/:qrToken', element: <DogProfile /> },
      { path: 'd/:qrToken/report', element: <ReportSighting /> },
      { path: 'd/:qrToken/report-problem', element: <ReportProblem /> },

      // Protected Admin & Volunteer Routes
      {
        element: <ProtectedLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'dashboard/dogs', element: <ManageDogs /> },
          { path: 'dashboard/dogs/new', element: <RegisterDog /> },
          { path: 'dashboard/dogs/:id', element: <DogDetails /> },
          { path: 'dashboard/reports', element: <Reports /> },
          { path: 'dashboard/sightings', element: <Sightings /> },
          { path: 'dashboard/health-records', element: <HealthRecords /> },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
