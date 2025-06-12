import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define types for our database entities
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'Kg' | 'Un';
}

export interface Menu {
  id?: number;
  name: string;
  createdAt: string;
  items: MenuItem[];
}

export interface ShoppingList {
  id?: number;
  name: string;
  createdAt: string;
  menuIds: number[]; // IDs of menus in this shopping list
  completed: boolean;
}

// Define the database schema
interface ShoppingAppDB extends DBSchema {
  menus: {
    key: number;
    value: Menu;
    indexes: { 'by-created': string };
  };
  shoppingLists: {
    key: number;
    value: ShoppingList;
    indexes: { 'by-created': string };
  };
}

class DatabaseService {
  private dbPromise: Promise<IDBPDatabase<ShoppingAppDB>>;

  constructor() {
    this.dbPromise = this.initDatabase();
  }

  private async initDatabase() {
    return openDB<ShoppingAppDB>('shopping-app-db', 1, {
      upgrade(db) {
        // Create menus store
        const menuStore = db.createObjectStore('menus', {
          keyPath: 'id',
          autoIncrement: true
        });
        menuStore.createIndex('by-created', 'createdAt');

        // Create shopping lists store
        const shoppingListStore = db.createObjectStore('shoppingLists', {
          keyPath: 'id',
          autoIncrement: true
        });
        shoppingListStore.createIndex('by-created', 'createdAt');
      }
    });
  }

  // Menu CRUD operations
  async saveMenu(name: string, items: MenuItem[]): Promise<number> {
    const db = await this.dbPromise;
    const menu: Menu = {
      name,
      createdAt: new Date().toISOString(),
      items
    };

    const id = await db.add('menus', menu);
    return id as number;
  }

  async getMenu(menuId: number): Promise<Menu | undefined> {
    const db = await this.dbPromise;
    return db.get('menus', menuId);
  }

  async getAllMenus(): Promise<Menu[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('menus', 'by-created');
  }

  // Shopping list CRUD operations
  async saveShoppingList(name: string, menuIds: number[]): Promise<number> {
    const db = await this.dbPromise;
    const shoppingList: ShoppingList = {
      name,
      createdAt: new Date().toISOString(),
      menuIds,
      completed: false
    };

    const id = await db.add('shoppingLists', shoppingList);
    return id as number;
  }

  async getShoppingList(listId: number): Promise<ShoppingList | undefined> {
    const db = await this.dbPromise;
    return db.get('shoppingLists', listId);
  }

  async getAllShoppingLists(): Promise<ShoppingList[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('shoppingLists', 'by-created');
  }

  async markShoppingListCompleted(listId: number, completed: boolean = true): Promise<void> {
    const db = await this.dbPromise;
    const shoppingList = await db.get('shoppingLists', listId);

    if (shoppingList) {
      shoppingList.completed = completed;
      await db.put('shoppingLists', shoppingList);
    }
  }

  // Get combined items from multiple menus
  async getCombinedItemsFromMenus(menuIds: number[]): Promise<MenuItem[]> {
    if (menuIds.length === 0) return [];

    const db = await this.dbPromise;
    const menus = await Promise.all(menuIds.map(id => db.get('menus', id)));

    // We need to combine items with the same ID across different menus
    const itemsByKey: Record<string, MenuItem> = {};

    // Get all items from the specified menus
    for (const menu of menus) {
      if (menu) {
        for (const item of menu.items) {
          if (itemsByKey[item.id]) {
            // Item already exists, add quantities
            itemsByKey[item.id].quantity += item.quantity;
          } else {
            // New item
            itemsByKey[item.id] = { ...item };
          }
        }
      }
    }

    return Object.values(itemsByKey);
  }
}

// Create and export a singleton instance
export const databaseService = new DatabaseService();
