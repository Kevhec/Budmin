import { createContext, useMemo, useState } from 'react';

export interface SidebarContextType {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

interface SidebarProviderProps {
  children: React.ReactNode
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const contextValue = useMemo(() => ({
    isExpanded,
    setIsExpanded,
  }), [isExpanded, setIsExpanded]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}
