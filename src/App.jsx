import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/pages/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="grades" element={<Grades />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;