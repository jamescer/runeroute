import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpeningRecord } from '../casket-simulator.models';

@Component({
  selector: 'app-casket-card',
  imports: [CommonModule],
  templateUrl: './casket-card.component.html',
  styleUrls: ['./casket-card.component.scss'],
})
export class CasketCardComponent {
  @Input() opening!: OpeningRecord;

  public getCasketImage(
    casketType: OpeningRecord['casketType'],
  ): string {
    return `assets/items/reward-casket-${casketType.toLowerCase()}.png`;
  }

  public getItemImage(itemName: string): string {
    const filename = itemName.toLowerCase().replace(/ /g, '-');
    return `assets/items/${filename}.png`;
  }

  public getItemQuantity(quantity?: number): number {
    if (typeof quantity === 'number' && quantity > 0) {
      return quantity;
    }
    return 1;
  }

  public getTotalCount(): number {
    return this.opening.items.reduce(
      (sum, item) => sum + this.getItemQuantity(item.quantity),
      0,
    );
  }
}
