"use client";

import DashboardView from "@/components/views/Dashboard";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);
export default function Home() {
  return (
    <main>
      <DashboardView />
    </main>
  );
}
