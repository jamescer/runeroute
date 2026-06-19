import { Pipe, PipeTransform } from '@angular/core';
import * as OSRSTools from 'osrs-tools';

@Pipe({
  name: 'sortByHighAlch',
  standalone: true,
})
export class SortByHighAlchPipe implements PipeTransform {
  transform(items: any[] | null | undefined): any[] {
    if (!items) return [];

    return [...items].sort((a, b) => {
      const aVal = (a.highAlch) || 0;
      const bVal = (b.highAlch) || 0;

      if (bVal === aVal) {
        // fallback to quantity if available
        return (b.quantity || 0) - (a.quantity || 0);
      }

      return bVal - aVal;
    });
  }
}
