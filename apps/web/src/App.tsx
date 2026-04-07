import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthProvider';
import AppRouter from '@/router';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
