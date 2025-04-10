import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IconHome2,
  IconSettings,
  IconSearch,
  IconClipboardList,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const navItems = [
    { path: '/', label: 'Inspección por Ambientes', icon: <IconHome2 size={24} />, color: '#007acc' },
    { path: '/elementos', label: 'Inspección por Elementos', icon: <IconSearch size={24} />, color: '#f39c12' },
    { path: '/excepciones', label: 'Excepciones', icon: <IconClipboardList size={24} />, color: '#e74c3c' },
    { path: '/config', label: 'Configuración', icon: <IconSettings size={24} />, color: '#4CAF50' }
  ];

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        {showLeftScroll && (
          <button 
            onClick={() => scroll('left')}
            className="nav-scroll-button left"
            aria-label="Scroll left"
          >
            <IconChevronLeft size={20} />
          </button>
        )}
        
        {showRightScroll && (
          <button 
            onClick={() => scroll('right')}
            className="nav-scroll-button right"
            aria-label="Scroll right"
          >
            <IconChevronRight size={20} />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          className="nav-scroll-container"
          onScroll={checkScroll}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
              style={{
                backgroundColor: location.pathname === item.path ? item.color : undefined
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
