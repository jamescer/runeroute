import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LootItem } from '../casket-simulator.models';
import { WikiItemImages } from '../../constants/wiki-item-images.constant';

@Component({
  selector: 'app-loot-card',
  imports: [CommonModule],
  templateUrl: './loot-card.component.html',
  styleUrls: ['./loot-card.component.scss'],
})
export class LootCardComponent {
  @Input() lootItem!: LootItem;

  public getItemImage(item: LootItem): string {
    return WikiItemImages.getClueItemImage(item.item.name) ?? '';
  }
}
