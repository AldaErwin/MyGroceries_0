import React, { createContext, useContext, ReactNode } from 'react';
import { databaseService, MenuItem, Menu, ShoppingList } from '../services/database';

// Interface for the context value
interface DatabaseContextType {
  // Menu operations
  saveMenu: (name: string, items: MenuItem[]) => Promise<number>;
  getMenu: (menuId: number) => Promise<Menu | undefined>;
  getAllMenus: () => Promise<Menu[]>;

  // Shopping list operations
  saveShoppingList: (name: string, menuIds: number[]) => Promise<number>;
  getShoppingList: (listId: number) => Promise<ShoppingList | undefined>;
  getAllShoppingLists: () => Promise<ShoppingList[]>;
  markShoppingListCompleted: (listId: number, completed?: boolean) => Promise<void>;

  // Item operations
  getCombinedItemsFromMenus: (menuIds: number[]) => Promise<MenuItem[]>;
}

// Create context with a default value
const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Custom hook for consuming the context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

// Provider component
interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  // Expose database service methods
  const contextValue: DatabaseContextType = {
    // Menu operations
    saveMenu: databaseService.saveMenu.bind(databaseService),
    getMenu: databaseService.getMenu.bind(databaseService),
    getAllMenus: databaseService.getAllMenus.bind(databaseService),

    // Shopping list operations
    saveShoppingList: databaseService.saveShoppingList.bind(databaseService),
    getShoppingList: databaseService.getShoppingList.bind(databaseService),
    getAllShoppingLists: databaseService.getAllShoppingLists.bind(databaseService),
    markShoppingListCompleted: databaseService.markShoppingListCompleted.bind(databaseService),

    // Item operations
    getCombinedItemsFromMenus: databaseService.getCombinedItemsFromMenus.bind(databaseService),
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};
