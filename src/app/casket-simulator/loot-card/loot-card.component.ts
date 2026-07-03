import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LootItem } from '../casket-simulator.models';
import { CLUE_ITEM_ID_OVERRIDES } from '../clue-item-id-overrides';

@Component({
  selector: 'app-loot-card',
  imports: [CommonModule],
  templateUrl: './loot-card.component.html',
  styleUrls: ['./loot-card.component.scss'],
})
export class LootCardComponent {
  @Input() lootItem!: LootItem;

  public getItemImage(item: LootItem): string {
    const filename = CLUE_ITEM_ID_OVERRIDES[item.item.name.toLowerCase()] ?? item.item.id;
    return `assets/items/${filename}.png`;
  }
}
