import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Star, BotMessageSquare } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="nav-container">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/portfolio" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Star size={20} />
        <span>Portfolio</span>
      </NavLink>
      <NavLink to="/bot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <BotMessageSquare size={20} />
        <span>Cryptobot</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
