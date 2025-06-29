import React, { useState } from 'react';
import Button from './ui/Button';

// Define types
interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'Kg' | 'Un';
}

interface AddItemsProps {
  menuNumber: number;
  totalMenus: number;
  existingItems: Item[];
  onSave: (items: Item[]) => void;
  onCancel: () => void;
}

// Mock data for food categories and items
const categories = [
  { id: 'fruits', name: 'Fruits',
    items: [
      { id: 'apple', name: 'Apple', unit: 'Kg' as const },
      { id: 'banana', name: 'Banana', unit: 'Kg' as const },
      { id: 'orange', name: 'Orange', unit: 'Kg' as const },
      { id: 'pineapple', name: 'Pineapple', unit: 'Kg' as const },
      { id: 'cherries', name: 'Cherries', unit: 'Kg' as const },
      { id: 'peaches', name: 'Peaches', unit: 'Kg' as const },
      { id: 'blueberries', name: 'Blueberries', unit: 'Kg' as const },
      { id: 'mangoes', name: 'Mangoes', unit: 'Kg' as const },
    ]
  },
  { id: 'vegetables', name: 'Vegetables',
    items: [
      { id: 'spinach', name: 'Spinach', unit: 'Kg' as const },
      { id: 'broccoli', name: 'Broccoli', unit: 'Kg' as const },
      { id: 'carrots', name: 'Carrots', unit: 'Kg' as const },
      { id: 'avocado', name: 'Avocado', unit: 'Kg' as const },
      { id: 'sweetpotato', name: 'Sweet Potato', unit: 'Kg' as const },
    ]
  },
  { id: 'protein', name: 'Protein',
    items: [
      { id: 'chicken', name: 'Chicken', unit: 'Un' as const },
      { id: 'beef', name: 'Beef', unit: 'Un' as const },
      { id: 'fish', name: 'Fish', unit: 'Un' as const },
      { id: 'eggs', name: 'Eggs', unit: 'Un' as const },
      { id: 'proteinbar', name: 'Protein Bar', unit: 'Un' as const },
    ]
  },
];

const AddItems: React.FC<AddItemsProps> = ({ menuNumber, totalMenus, existingItems, onSave, onCancel }) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(existingItems || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0].id);

  const addItem = (itemToAdd: Item) => {
    const existingItemIndex = selectedItems.findIndex(item => item.id === itemToAdd.id);

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        {
          id: itemToAdd.id,
          name: itemToAdd.name,
          category: itemToAdd.category,
          quantity: 1,
          unit: itemToAdd.unit
        }
      ]);
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow quantities less than 1

    setSelectedItems(selectedItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const toggleUnit = (itemId: string) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId ? { ...item, unit: item.unit === 'Kg' ? 'Un' : 'Kg' } : item
    ));
  };

  // Find items that match the search term or category
  const filteredItems: Item[] = searchTerm
    ? categories.flatMap(cat =>
        cat.items
          .filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(item => ({
            ...item,
            category: cat.id,
            quantity: 1,
          }))
      )
    : selectedCategory
      ? (
          categories
            .find(cat => cat.id === selectedCategory)?.items.map(item => ({
              ...item,
              category: selectedCategory,
              quantity: 1,
            })) || []
        )
      : [];

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-orange-500 text-white text-2xl font-medium py-4 px-6 rounded-full mb-6 text-center">
        Add the items of Menu {menuNumber}:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Search and item selection */}
        <div className="bg-black rounded-lg p-4">
          {/* Search bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 bg-white rounded-lg text-gray-800"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Item grid */}
          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-96">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => addItem(item)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="aspect-square w-full bg-gray-800 rounded-lg mb-1"></div>
                <div className="text-center text-sm truncate w-full">{item.name}</div>
              </div>
            ))}
          </div>

          {/* Category buttons */}
          {!searchTerm && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category.id ? 'bg-orange-500' : 'bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Selected items */}
        <div>
          <div className="bg-black rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-3 border-b border-gray-800">Item</th>
                  <th className="p-3 border-b border-gray-800">Quantity</th>
                  <th className="p-3 border-b border-gray-800">KG or Q</th>
                  <th className="p-3 border-b border-gray-800"></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 bg-transparent border border-gray-700 rounded p-1 text-center"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUnit(item.id)}
                        className={`rounded-full px-3 py-1 ${
                          item.unit === 'Kg' ? 'bg-yellow-100 text-black' : 'bg-blue-900 text-white'
                        }`}
                      >
                        {item.unit}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-red-600 w-6 h-6 flex items-center justify-center rounded"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {selectedItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No items added yet. Select items from the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center flex gap-4 flex-wrap justify-center">
            <Button
              onClick={() => onSave(selectedItems)}
              size="lg"
            >
              Save Menu
            </Button>

            <Button
              onClick={onCancel}
              size="lg"
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
