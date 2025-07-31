import { useContext } from 'react';
import { SidebarContext } from '@/context/SidebarProvider';

function useSidebar() {
  const sidebarContext = useContext(SidebarContext);
  if (sidebarContext === undefined || sidebarContext === null) {
    throw new Error('useSidebar must be used within an SidebarProvider');
  }
  return sidebarContext;
}

export default useSidebar;
