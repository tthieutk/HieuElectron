import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Timecard } from './pages/Timecard';
import { TimecardSetting } from './pages/Timecard/TimecardSetting';
import { TimecardList } from './pages/Timecard/TimecardList';
import { TimecardEdit } from './pages/Timecard/TimecardEdit';
import UserEdit from './pages/Users/UserEdit';
import { UserDetail } from './pages/Users/UserDetail';
import { Dayoff } from './pages/Dayoff';
import { DayoffRegister } from './pages/Dayoff/DayoffRegister';
import { DayoffApply } from './pages/Dayoff/DayoffApply';
import { Group } from './pages/Group';
import { GroupEdit } from './pages/Group/GroupEdit';
import { Module } from './pages/Module';
import { Application } from './pages/Application';
import { Estimate } from './pages/Estimate';
import { TravelExpenses } from './pages/Estimate/TravelExpenses';
import { ExpenseReport } from './pages/Estimate/ExpenseReport';
import { PriceBusinessReport } from './pages/Estimate/PriceBusinessReport';
import { TravelAllowance } from './pages/Estimate/TravelAllowance';
import Login from './pages/Login';
import DefaultLayout from './layouts/DefaultLayout';
import FluidLayout from './layouts/FluidLayout/FluidLayout';
import Members from './pages/Members';
import MemberAdd from './pages/Members/MemberAdd';
import MemberEdit from './pages/Members/MemberEdit';
import RequireAuth from './components/RequireAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Field from './pages/From/Field';
import { Tab1Content } from './components/Tabs/Tab1Content';
import { Tab2Content } from './components/Tabs/Tab2Content';
import {Tab3Content} from './components/Tabs/Tab3Content';
import {Tab4Content} from './components/Tabs/Tab4Content';
import { Tab5Content } from './components/Tabs/Tab5Content';
import { Tab6Content } from './components/Tabs/Tab6Content';
import {Tab7Content} from './components/Tabs/Tab7Content';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FluidLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<DefaultLayout />}>
              <Route path="dashboard" element={<Home />} />
              <Route path="timecards" element={<Timecard />} />
              <Route path="timecards/add" element={<Timecard />} />
              <Route path="timecards/setting" element={<TimecardSetting />} />
              <Route path="timecards/list" element={<TimecardList />} />
              <Route path="timecards/edit" element={<TimecardEdit />} />
              <Route path="timecarddetails/add" element={<Timecard />} />
              <Route path="timecarddetails/update" element={<Timecard />} />
              <Route path="timecarddetails/updateall" element={<Timecard />} />
              <Route
                path="timecarddetails/updatecomment"
                element={<Timecard />}
              />
              <Route path="holidays" element={<Timecard />} />
              <Route path="users/edit/:id" element={<UserEdit />} />
              <Route path="users/detail/:userid" element={<UserDetail />} />
              <Route path="members" element={<Members />} />
              <Route path="members/add" element={<MemberAdd />} />
              <Route path="members/edit/:id" element={<MemberEdit />} />
              <Route path="dayoffs" element={<Dayoff />} />
              <Route path="dayoffs/apply" element={<DayoffApply />} />
              <Route path="dayoffs/delete/:id" />
              <Route path="dayoffs/update/:id" />
              <Route path="dayoffs/refuse/:id" />
              <Route path="dayoffs/register" element={<DayoffRegister />} />
              <Route path="dayoffs/getforuser/:id" />
              <Route path="dayoffs/getalluser/:id" />

              <Route path="group" element={<Group />} />
              <Route path="group/edit" element={<GroupEdit />} />
              <Route path="module" element={<Module />} />
              <Route path="application" element={<Application />} />
              {/* Khu cua thịnh */}
              <Route path="estimate" element={<Estimate />} />
              <Route path="/TravelExpenses" element={<TravelExpenses />} />
              <Route path="/ExpenseReport" element={<ExpenseReport />} />
              <Route path="/PriceBusinessReport" element={<PriceBusinessReport />} />
              <Route path="/TravelAllowance" element={<TravelAllowance />} />
              {/* Khu cua thịnh */}

              <Route path="field" element={<Field />} />


              <Route path="tabs/tab1" element={<Tab1Content />} />
              <Route path="tabs/tab2" element={<Tab2Content />} />
              <Route path="tabs/tab3" element={<Tab3Content />} />
              <Route path="tabs/tab4" element={<Tab4Content />} />
              <Route path="tabs/tab5" element={<Tab5Content />} />
              <Route path="tabs/tab6" element={<Tab6Content />} />
              <Route path="tabs/tab7" element={<Tab7Content />} />
            </Route>
          </Route>
          <Route path="/login" element={<FluidLayout />}>
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}
