import React from 'react';
import Button from './ui/Button';

interface HomeScreenProps {
  onAddShoppingList: () => void;
  onViewHistory: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onAddShoppingList, onViewHistory }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-8">
      <Button
        onClick={onAddShoppingList}
        size="lg"
        className="text-2xl"
      >
        Add shopping list
        <span className="ml-2 bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </Button>

      <Button
        variant="primary"
        size="lg"
        className="text-2xl"
        onClick={onViewHistory}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        History
      </Button>
    </div>
  );
};

export default HomeScreen;
