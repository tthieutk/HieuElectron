import Dashboard from '../../components/Dashboard/Dashboard';
import { TimeProvider } from '../../context/TimeProvider';

function Home() {
  return (
    <TimeProvider>
      <Dashboard/>
    </TimeProvider>
  )
}

export default Home;
