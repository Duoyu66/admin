import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from '@/providers/AppProvider';
import '@/styles/global.less';
import '@/styles/antd-overrides.less';
import { useThemeStore } from '@/stores/themeStore';

useThemeStore.getState().applyTheme();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <AppProvider>
    <App />
  </AppProvider>
);
