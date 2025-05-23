
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Target, Package, BarChart, BookText } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: Target, path: '/goals', label: 'Goals' },
    { icon: Package, path: '/projects', label: 'Projects' },
    { icon: BarChart, path: '/analytics', label: 'Analytics' },
    { icon: BookText, path: '/rulebook', label: 'Rulebook' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen bg-sidebar w-16 flex flex-col items-center py-6 z-10">
      <div className="mb-10 text-2xl font-bold text-sidebar-foreground">
        <span className="sr-only">Streakly</span>
        <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">S</div>
      </div>
      
      <nav className="flex flex-col items-center space-y-8">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `w-12 h-12 flex items-center justify-center rounded-md transition-all ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-muted'
              }`
            }
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
