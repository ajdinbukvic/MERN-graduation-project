import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Forgot from "./pages/auth/Forgot";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import Verify from "./pages/auth/Verify";
import ChangePassword from "./pages/changePassword/ChangePassword";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import UserList from "./pages/userList/UserList";
import TwoFactor from "./pages/twoFactorAuth/TwoFactor";
import ActiveTasks from "./pages/tasks/ActiveTasks";
import CompletedTasks from "./pages/tasks/CompletedTasks";
import MissingTasks from "./pages/tasks/MissingTasks";
import CreateTask from "./pages/taskActions/CreateTask";
import GetTask from "./pages/taskActions/GetTask";
import UpdateTask from "./pages/taskActions/UpdateTask";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginWithCode from "./pages/auth/LoginWithCode";
import CreateProject from "./pages/createProject/CreateProject";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user, isLoggedIn]);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/loginWithCode/:email" element={<LoginWithCode />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<Forgot />} />
            <Route path="/resetPassword/:resetToken" element={<Reset />} />
            <Route
              path="/verifyEmail/:verificationToken"
              element={
                <Layout>
                  <Verify />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/changePassword"
              element={
                <Layout>
                  <ChangePassword />
                </Layout>
              }
            />
            <Route
              path="/twoFactorAuth"
              element={
                <Layout>
                  <TwoFactor />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <UserList />
                </Layout>
              }
            />
            <Route
              path="/createProject"
              element={
                <Layout>
                  <CreateProject />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/active"
              element={
                <Layout>
                  <ActiveTasks />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/completed"
              element={
                <Layout>
                  <CompletedTasks />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/missing"
              element={
                <Layout>
                  <MissingTasks />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/createTask"
              element={
                <Layout>
                  <CreateTask />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/task/:id"
              element={
                <Layout>
                  <GetTask />
                </Layout>
              }
            />
            <Route
              path="/project/:projectId/updateTask/:id"
              element={
                <Layout>
                  <UpdateTask />
                </Layout>
              }
            />
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
