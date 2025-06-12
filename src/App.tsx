import { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import MenuSelection from './components/MenuSelection';
import AddItems from './components/AddItems';
import FinalSummary from './components/FinalSummary';
import HistoryView from './components/HistoryView';
import { useDatabase } from './contexts/DatabaseContext';
import { MenuItem } from './services/database';

interface AppMenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'Kg' | 'Un';
}

function App() {
  const db = useDatabase();
  const [screen, setScreen] = useState('home'); // home, menuSelection, addItems, summary, history
  const [menus, setMenus] = useState<number>(0);
  const [currentMenu, setCurrentMenu] = useState<number>(1);
  const [menuItems, setMenuItems] = useState<Record<number, AppMenuItem[]>>({});
  const [allItems, setAllItems] = useState<AppMenuItem[]>([]);
  const [shoppingListName, setShoppingListName] = useState<string>('');
  const [savedMenuIds, setSavedMenuIds] = useState<number[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  // Fetch shopping list details when selectedListId changes
  useEffect(() => {
    if (selectedListId) {
      const fetchShoppingList = async () => {
        const list = await db.getShoppingList(selectedListId);
        if (list) {
          const combinedItems = await db.getCombinedItemsFromMenus(list.menuIds);
          setAllItems(combinedItems);
          setShoppingListName(list.name);
          setSavedMenuIds(list.menuIds);
          setScreen('summary');
        }
      };

      fetchShoppingList();
    }
  }, [selectedListId, db]);

  const goToMenuSelection = () => {
    // Reset state when starting a new shopping list
    setMenus(0);
    setCurrentMenu(1);
    setMenuItems({});
    setAllItems([]);
    setShoppingListName('');
    setSavedMenuIds([]);
    setSelectedListId(null);
    setScreen('menuSelection');
  };

  const goToHistory = () => {
    setScreen('history');
  };

  const goToAddItems = (menuNumber: number) => {
    setCurrentMenu(menuNumber);
    setScreen('addItems');
  };

  const goToSummary = async () => {
    // Prepare to save menus to database
    const savedIds: number[] = [];

    // Save each menu to database
    for (let i = 1; i <= menus; i++) {
      const menuName = `Menu ${i}`;
      const items = menuItems[i] || [];

      try {
        const menuId = await db.saveMenu(menuName, items);
        savedIds.push(menuId);
      } catch (error) {
        console.error(`Error saving menu ${i}:`, error);
      }
    }

    // Save the shopping list with all menu references
    if (savedIds.length > 0) {
      try {
        const listName = new Date().toLocaleDateString();
        const listId = await db.saveShoppingList(listName, savedIds);
        setShoppingListName(listName);
        setSavedMenuIds(savedIds);

        // Get combined items for display
        const combinedItems = await db.getCombinedItemsFromMenus(savedIds);
        setAllItems(combinedItems);
      } catch (error) {
        console.error('Error saving shopping list:', error);
      }
    }

    setScreen('summary');
  };

  const handleAddMenu = (count: number) => {
    setMenus(count);
    // We no longer automatically navigate to the add items screen
    // Instead, we stay on the menu selection screen to show the preview
  };

  const handleMenuSelect = (menuNumber: number) => {
    goToAddItems(menuNumber);
  };

  const saveMenuItems = (items: AppMenuItem[]) => {
    setMenuItems(prev => ({
      ...prev,
      [currentMenu]: items
    }));

    // Return to menu selection screen to show all menus
    setScreen('menuSelection');
  };

  const confirmAllMenus = () => {
    // This is called when the user confirms they have completed all menus
    goToSummary();
  };

  const selectShoppingList = (listId: number) => {
    setSelectedListId(listId);
  };

  const startOver = () => {
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto">
        {screen === 'home' && (
          <HomeScreen
            onAddShoppingList={goToMenuSelection}
            onViewHistory={goToHistory}
          />
        )}

        {screen === 'menuSelection' && (
          <MenuSelection
            menus={menus}
            setMenus={handleAddMenu}
            menuItems={menuItems}
            onMenuSelect={handleMenuSelect}
            onConfirmAll={confirmAllMenus}
          />
        )}

        {screen === 'addItems' && (
          <AddItems
            menuNumber={currentMenu}
            totalMenus={menus}
            existingItems={menuItems[currentMenu] || []}
            onSave={saveMenuItems}
            onCancel={() => setScreen('menuSelection')}
          />
        )}

        {screen === 'summary' && (
          <FinalSummary
            items={allItems}
            name={shoppingListName}
            onStartOver={startOver}
          />
        )}

        {screen === 'history' && (
          <HistoryView
            onSelectList={selectShoppingList}
            onBack={startOver}
          />
        )}
      </div>
    </div>
  );
}

export default App;
