import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import createRoutes from "./app/routes/index";
import { QueryClientProvider } from "@tanstack/react-query";
import "./Global.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "./app/react-query-client";
import ErrorBoundary from "./ErrorBoundary";

const App: React.FC = () => {
  const routes = createRoutes();
  const router = createBrowserRouter(routes);


  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
