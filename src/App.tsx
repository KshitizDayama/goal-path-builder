
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Goals from "./pages/Goals";
import GoalDetail from "./pages/GoalDetail";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import Rulebook from "./pages/Rulebook";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/goals" replace />} />
            <Route path="goals" element={<Goals />} />
            <Route path="goal/:id" element={<GoalDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="rulebook" element={<Rulebook />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
