import { AppErrorBoundary } from './app/error-boundary';
import { Providers } from './app/providers';
import './App.css';

function App() {
  return (
    <AppErrorBoundary>
      <Providers />
    </AppErrorBoundary>
  );
}

export default App;
