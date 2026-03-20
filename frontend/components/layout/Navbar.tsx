"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Power, Home, ListTodo, CheckCircle, Clock, Menu, X } from "lucide-react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  filter?: string;
};

export default function Navbar({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: string;
  onFilterChange: (f: string) => void;
  counts: { all: number; active: number; done: number };
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: <Home size={18} />, label: "All Tasks", filter: "all" },
    { icon: <Clock size={18} />, label: "Active", filter: "active" },
    { icon: <CheckCircle size={18} />, label: "Completed", filter: "done" },
  ];

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E7E5E4] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5A461] to-[#E8864A] flex items-center justify-center">
            <ListTodo size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[#1C1917]">Glorified Todo</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-[#F5F5F4] cursor-pointer"
        >
          {mobileOpen ? <X size={20} className="text-[#78716C]" /> : <Menu size={20} className="text-[#78716C]" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slides in when mobileOpen */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white flex flex-col justify-between py-6 px-5 border-r border-[#E7E5E4] transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F5A461] to-[#E8864A] flex items-center justify-center">
              <ListTodo size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[#1C1917] tracking-tight">
              Glorified Todo
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeFilter === item.filter;
              return (
                <button
                  key={item.filter}
                  onClick={() => handleFilterClick(item.filter!)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#FFEEDD] text-[#E8864A]"
                      : "text-[#78716C] hover:bg-[#FFF8F3] hover:text-[#44403C]"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#E8864A] text-white"
                        : "bg-[#F5F5F4] text-[#A8A29E]"
                    }`}
                  >
                    {counts[item.filter as keyof typeof counts]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-2">
          <Button
            onClick={() => {
              localStorage.removeItem("accessToken");
              router.push("/auth");
            }}
            variant="ghost"
            className="w-full justify-start gap-3 text-[#A8A29E] hover:text-[#F87171] hover:bg-[#FEF2F2] rounded-xl cursor-pointer"
          >
            <Power size={18} />
            <span className="text-sm font-medium">Log out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
