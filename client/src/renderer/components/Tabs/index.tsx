import React from 'react';
import { NavLink } from 'react-router-dom';

interface TabProps {
    to: string;
    label: string;
    params?: { [key: string]: any };
}

export  const Tab: React.FC<TabProps> = ({ to, label, params }) => {
    return (
      <div className="tab-head__item">
        <NavLink
          to={{ pathname: to, state: params }}
          activeClassName="active" // Lớp CSS khi tab active
        >
          <span>{label}</span>
        </NavLink>
      </div>
    );
  };
  
  interface TabsProps {
    tabs: TabProps[];
  }
  
export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
return (
    <div className='tab01 tab-head'>
    {tabs.map((tab, index) => (
        <Tab key={index} {...tab} />
    ))}
    </div>
);
};