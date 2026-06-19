import { Item, CasketReward } from 'osrs-tools';

export interface LootItem {
  item: Item;
  quantity: number;
  image?: string;
  highAlch?: number;
  lowAlch?: number;
}

export interface OpeningRecord {
  casketType: 'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master';
  items: Item[];
  timestamp: Date;
  reward: CasketReward;
  openingNumber: number;
}
