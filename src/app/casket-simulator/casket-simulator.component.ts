import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasketCardComponent } from './casket-card/casket-card.component';
import { LootCardComponent } from './loot-card/loot-card.component';
import { ClueScrollHelper, Item } from 'osrs-tools';
import { LootItem, OpeningRecord } from './casket-simulator.models';
import { WikiItemImages } from '../constants/wiki-item-images.constant';

@Component({
  selector: 'app-casket-simulator',
  imports: [
    CommonModule,
    FormsModule,
    CasketCardComponent,
    LootCardComponent,
  ],
  templateUrl: './casket-simulator.component.html',
  styleUrls: ['./casket-simulator.component.scss'],
})
export class CasketSimulatorComponent implements OnInit {
  public selectedCasketType:
    | 'beginner'
    | 'easy'
    | 'medium'
    | 'hard'
    | 'elite'
    | 'master' = 'easy';
  public quantity: number = 1;
  public Math = Math;

  public casketTypes: Array<
    'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master'
  > = ['beginner', 'easy', 'medium', 'hard', 'elite', 'master'];

  public totalLoot: LootItem[] = [];
  public activeTab: 'openings' | 'total' = 'openings';
  public openingHistory: OpeningRecord[] = [];

  constructor() { }

  ngOnInit(): void {
    // No setup needed yet; controls are template driven.
  }

  public selectCasket(
    casketType: 'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master',
  ): void {
    this.selectedCasketType = casketType;
  }

  public simulate(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }

    const allItems: Item[] = [];

    // For each opening, simulate and record
    for (let i = 0; i < this.quantity; i++) {
      const reward = ClueScrollHelper.openCasket(this.selectedCasketType);
      allItems.push(...reward.items);
      const openingRecord: OpeningRecord = {
        casketType: this.selectedCasketType,
        items: reward.items,
        timestamp: new Date(),
        reward,
        openingNumber: this.openingHistory.length + 1,
      };

      // Add to history
      this.openingHistory.unshift(openingRecord);
    }

    // Update total loot with all items from simulations
    this.updateTotalLoot(allItems);

    // Switch to openings tab to show results
    this.activeTab = 'openings';
  }

  private updateTotalLoot(items: Item[]): void {
    for (const item of items) {
      const itemName = item.name;
      const itemQuantity = this.getItemQuantity(item);
      const existingItem = this.totalLoot.find((l) => l.item.name === itemName);

      if (existingItem) {
        existingItem.quantity += itemQuantity;
      } else {
        this.totalLoot.push({
          item: item,
          quantity: itemQuantity,
          image: this.getItemImage(item),
          highAlch: (item as Item).highAlch || 0,
          lowAlch: (item as Item).lowAlch || 0,
        });
      }
    }

    this.sortTotalLootByHighAlch();
  }

  private sortTotalLootByHighAlch(): void {
    this.totalLoot.sort((a, b) => {
      const highAlchDifference = (b.highAlch ?? 0) - (a.highAlch ?? 0);

      if (highAlchDifference !== 0) {
        return highAlchDifference;
      }

      return a.item.name.localeCompare(b.item.name);
    });
  }

  public resetLoot(): void {
    this.totalLoot = [];
    this.openingHistory = [];
    this.activeTab = 'openings';
  }

  public getCasketImage(
    casketType: 'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master',
  ): string {
    return WikiItemImages.REWARD_CASKETS[casketType];
  }

  public getItemImage(lootItem: Item): string {
    return WikiItemImages.getClueItemImage(lootItem.name) ?? '';
  }

  public switchTab(tab: 'openings' | 'total'): void {
    this.activeTab = tab;
  }

  public getItemQuantity(item: Item): number {
    if (typeof item.quantity === 'number' && item.quantity > 0) {
      return item.quantity;
    }

    return 1;
  }

  public getOpeningItemTotal(opening: OpeningRecord): number {
    return opening.items.reduce(
      (sum, item) => sum + this.getItemQuantity(item),
      0,
    );
  }

  public getTotalItemsObtained(): number {
    return this.totalLoot.reduce((sum, item) => sum + item.quantity, 0);
  }

  public getTotalCasketsOpened(): number {
    return this.openingHistory.length;
  }

  public getAverageItemsPerCasket(): number {
    if (this.openingHistory.length === 0) {
      return 0;
    }

    return this.getTotalItemsObtained() / this.openingHistory.length;
  }
}
