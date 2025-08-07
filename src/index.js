import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import Loading from "./Loader/Loading";
import { allTaskLoader } from "./loaders/allTaskLoader";
import NotFound from "./ErrorPages/NotFound";
import ErrorPage from "./ErrorPages/ErrorPage";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./RouteGuards/ProtectedRoute";

const AllTasks = React.lazy(() => import("./components/AllTasks"));

const router = createBrowserRouter([
  {
    path: "",
    element: <Navbar />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/taskform",
        element: (
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/alltasks",
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<Loading />}>
              <AllTasks />
            </React.Suspense>
          </ProtectedRoute>
        ),
        loader: allTaskLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
