import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { useDatabase } from '../contexts/DatabaseContext';
import { ShoppingList } from '../services/database';

interface HistoryViewProps {
  onSelectList: (listId: number) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelectList, onBack }) => {
  const db = useDatabase();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const lists = await db.getAllShoppingLists();
        setShoppingLists(lists);
      } catch (error) {
        console.error("Error fetching shopping lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, [db]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const handleSelectList = (listId: number) => {
    onSelectList(listId);
  };

  return (
    <div className="w-full">
      <div className="bg-orange-500 text-white text-2xl font-medium py-4 px-6 rounded-full mb-8 text-center">
        Shopping List History
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : shoppingLists.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-8">No shopping lists found.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {shoppingLists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
              onClick={() => list.id && handleSelectList(list.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{list.name}</h3>
                  <p className="text-gray-400">{formatDate(list.createdAt)}</p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-400">Menus: </span>
                    {list.menuIds.length}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      list.completed ? 'bg-green-700' : 'bg-blue-700'
                    }`}
                  >
                    {list.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={onBack}>Go Back</Button>
      </div>
    </div>
  );
};

export default HistoryView;
