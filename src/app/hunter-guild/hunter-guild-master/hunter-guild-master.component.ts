import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HunterGuildMaster, HunterRumour } from 'osrs-tools';

@Component({
  selector: 'app-hunter-guild-master',
  imports: [CommonModule, FormsModule],
  templateUrl: './hunter-guild-master.component.html',
  styleUrl: './hunter-guild-master.component.scss',
})
export class HunterGuildMasterComponent {
  @Input() master = new HunterGuildMaster('Hunter Guild Master', 'Novice', 1);
  @Input() rumours: HunterRumour[] = [];
  @Input() possibleRumours: HunterRumour[] = [];
  @Input() currentRumour: HunterRumour | null = null;
  @Input() errorMessage = '';

  @Output() selectedRumourChange = new EventEmitter<string>();
  @Output() getRumourClicked = new EventEmitter<void>();

  onSelectedRumourChange(rumourId: string): void {
    this.selectedRumourChange.emit(rumourId);
  }

  getRumour(): void {
    this.getRumourClicked.emit();
  }

  getLocationList(rumour: HunterRumour): string {
    return rumour.locations.map((location) => location.name).join(', ');
  }

  getRequirementList(rumour: HunterRumour): string {
    const requirements = [`${rumour.requiredHunterLevel} Hunter`];

    if (rumour.questRequirements.length) {
      requirements.push(rumour.questRequirements.join(', '));
    }

    return requirements.join(' + ');
  }
}
