import React from 'react';
import Button from './ui/Button';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'Kg' | 'Un';
}

interface MenuSelectionProps {
  menus: number;
  setMenus: (count: number) => void;
  menuItems: Record<number, MenuItem[]>;
  onMenuSelect: (menuNumber: number) => void;
  onConfirmAll: () => void;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({
  menus,
  setMenus,
  menuItems,
  onMenuSelect,
  onConfirmAll
}) => {
  const incrementMenus = () => {
    setMenus(menus + 1);
  };

  const decrementMenus = () => {
    if (menus > 0) {
      setMenus(menus - 1);
    }
  };

  const handleMenuClick = (menuNumber: number) => {
    onMenuSelect(menuNumber);
  };

  const isMenuComplete = (menuNumber: number) => {
    return menuItems[menuNumber] && menuItems[menuNumber].length > 0;
  };

  const areAllMenusComplete = () => {
    if (menus === 0) return false;

    for (let i = 1; i <= menus; i++) {
      if (!isMenuComplete(i)) {
        return false;
      }
    }
    return true;
  };

  const getMenuItemsPreview = (menuNumber: number) => {
    const items = menuItems[menuNumber] || [];
    if (items.length === 0) {
      return <div className="text-gray-500 italic">No items added yet...</div>;
    }

    const topItems = items.slice(0, 8); // Show first 8 items
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {topItems.map(item => (
          <React.Fragment key={item.id}>
            <div className="text-lg">{item.name}</div>
            <div className="text-lg text-right">{item.quantity}</div>
          </React.Fragment>
        ))}
        {items.length > 8 && (
          <div className="col-span-2 text-gray-500 text-center">
            + {items.length - 8} more items
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <div className="text-2xl font-medium bg-orange-500 px-8 py-4 rounded-full mb-4 w-full text-center">
        How many menus do you want?
      </div>

      <div className="flex items-center bg-orange-500 rounded-full px-4 py-2">
        <button
          onClick={decrementMenus}
          className="text-3xl font-bold w-10 h-10 flex items-center justify-center"
        >
          -
        </button>
        <span className="text-3xl font-bold px-6">{menus}</span>
        <button
          onClick={incrementMenus}
          className="text-3xl font-bold w-10 h-10 flex items-center justify-center"
        >
          +
        </button>
      </div>

      {menus > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {Array.from({ length: menus }).map((_, index) => {
            const menuNumber = index + 1;
            const menuComplete = isMenuComplete(menuNumber);

            return (
              <div
                key={index}
                className={`border border-gray-800 rounded-3xl p-4 text-left bg-black cursor-pointer ${
                  menuComplete ? 'border-green-600' : 'hover:border-gray-600'
                }`}
                onClick={() => handleMenuClick(menuNumber)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold">Menu {menuNumber}:</h3>
                  {menuComplete && (
                    <span className="bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                {getMenuItemsPreview(menuNumber)}
              </div>
            );
          })}
        </div>
      )}

      {menus > 0 && (
        <div className="mt-8 text-center flex gap-4 flex-wrap justify-center">
          <Button
            onClick={() => onMenuSelect(1)}
            size="lg"
            variant={!areAllMenusComplete() ? 'primary' : 'secondary'}
          >
            {!areAllMenusComplete() ? 'Add Items to Menus' : 'Edit Menus'}
          </Button>

          {areAllMenusComplete() && (
            <Button
              onClick={onConfirmAll}
              size="lg"
            >
              Confirm All Menus
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
