import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./components/signin";
import LoginPage from "./components/logging";
import EmailVerificationPage from "./components/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import DashboardPage from "./components/Dashboard";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Preloader from "./components/preloader";


// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};


// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


function App() {

  const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

  if (isCheckingAuth) return <Preloader />;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-100 via-blue-200 to-cyan-200 flex items-center justify-center relative overflow-hidden">


      <Routes>
        <Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
            <SignUpPage />
           </RedirectAuthenticatedUser>
          }
        />
        <Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
        <Route path="/verify-email" element={<EmailVerificationPage/>} />

        <Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

        <Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />


      </Routes>
      <Toaster />
      
    </div>
  );
}

export default App;
