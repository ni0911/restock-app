export type DefaultCategory = '食品' | 'キッチン用品' | '洗剤・掃除用品' | '衛生用品' | '文房具';
export type Category = DefaultCategory | string;

export type SortOrder = 'nextPurchaseDate' | 'purchaseDate' | 'price' | 'name';

export type ItemStatus = 'all' | 'noDate' | 'overdue' | 'upcoming' | 'due';

export interface FilterOptions {
  category: Category | 'all';
  userId: string | 'all';
  status: ItemStatus;
  searchText: string;
}

export interface Item {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  store: string;
  purchaseDate: Date;
  nextPurchaseDate: Date | null;
  userId: string;
}

export type NewItem = Partial<Item>; 