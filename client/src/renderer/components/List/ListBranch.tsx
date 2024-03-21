import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

interface ListBranchProps {
  branch: {
    text: string;
    to: string;
  }[];
}

interface ListTabProps {
  tab: {
    text: string;
    to: string;
  }[];
}

const ListBranch: React.FC<ListBranchProps> = ({ branch }) => {
  // const [activeTab, setActiveTab] = useState<number>(() => {
  //   const storedTab = localStorage.getItem('activeTab');
  //   return storedTab ? parseInt(storedTab, 10) : 0;
  // });

  // const handleTabClick = (tabId: number) => {
  //   setActiveTab(tabId);
  //   localStorage.setItem('activeTab', tabId.toString());
  // };

  // useEffect(() => {
  //   localStorage.setItem('activeTab', activeTab.toString());
  // }, [activeTab]);

  return (
    <>
      <ul className="lst-branch">
        {branch.map((item, index) => (
          // <li key={index}><Link to={item.to} onClick={() => handleTabClick(index)} className={`tab ${index === activeTab ? 'active' : ''}`}>{item.text}</Link></li>
          <li key={index}><NavLink to={item.to}>{item.text}</NavLink></li>
        ))}
      </ul>
    </>
  );
};

export default ListBranch;

export const ListTabs:React.FC<ListTabProps> = ({ tab }) => {

  return (
    <div className='tab01 tab-head'>
      {tab.map((item, index) => (
        <div key={index}>
          <NavLink to={item.to}>{item.text}</NavLink>
        </div>
      ))}
    </div>
  );
};
