import { createRoot } from 'react-dom/client';
import { GlobalStyles } from './components/GlobalStyles/GlobalStyles';
import App from './App';
import {AuthProvider} from './context/AuthProvider';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <AuthProvider>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </AuthProvider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
