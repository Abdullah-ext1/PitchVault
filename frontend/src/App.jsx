import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import Discover from "./pages/Discover";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PitchDetail from "./pages/PitchDetail";
import PitchCreate from "./pages/PitchCreate";
import PitchEdit from "./pages/PitchEdit";
import MyPitches from "./pages/MyPitches";
import Investors from "./pages/Investors";
import Inbox from "./pages/Inbox";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <main className="main-content" id="view" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pitches/:pitchId" element={<PitchDetail />} />
            <Route path="/investors" element={<Investors />} />

            <Route
              path="/pitches/new"
              element={
                <RoleRoute allowedRoles={["founder"]}>
                  <PitchCreate />
                </RoleRoute>
              }
            />

            <Route
              path="/pitches/:pitchId/edit"
              element={
                <RoleRoute allowedRoles={["founder"]}>
                  <PitchEdit />
                </RoleRoute>
              }
            />

            <Route
              path="/my-pitches"
              element={
                <RoleRoute allowedRoles={["founder"]}>
                  <MyPitches />
                </RoleRoute>
              }
            />

            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
