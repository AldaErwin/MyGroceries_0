import React from 'react';
import Button from './ui/Button';

interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'Kg' | 'Un';
}

interface FinalSummaryProps {
  items: Item[];
  name: string;
  onStartOver: () => void;
}

const FinalSummary: React.FC<FinalSummaryProps> = ({ items, name, onStartOver }) => {
  // Group items by category for better organization
  const itemsByCategory: Record<string, Item[]> = {};

  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-orange-500 text-white text-2xl font-medium py-4 px-6 rounded-full mb-8 text-center">
        {name ? `Shopping List: ${name}` : 'Final Shopping List Summary'}
      </div>

      {Object.keys(itemsByCategory).length > 0 ? (
        <div className="grid gap-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <div key={category} className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="bg-gray-800 py-2 px-4 font-medium">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="p-3">Item</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-800">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-3 py-1 ${
                            item.unit === 'Kg' ? 'bg-yellow-100 text-black' : 'bg-blue-900 text-white'
                          }`}>
                          {item.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No items added to any menu yet.
        </div>
      )}

      <div className="mt-8 text-center">
        <Button
          onClick={onStartOver}
          size="lg"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default FinalSummary;
