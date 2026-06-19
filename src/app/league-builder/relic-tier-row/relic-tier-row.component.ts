import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-relic-tier-row',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './relic-tier-row.component.html',
  styleUrl: './relic-tier-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelicTierRowComponent {
  @Input({ required: true }) tierGroup!: FormGroup;
  @Input({ required: true }) tierIndex!: number;

  @Output() tierRemoved = new EventEmitter<void>();
  @Output() relicAdded = new EventEmitter<void>();
  @Output() relicRemoved = new EventEmitter<number>();
  @Output() passiveAdded = new EventEmitter<void>();
  @Output() passiveRemoved = new EventEmitter<number>();
  @Output() effectAdded = new EventEmitter<number>();
  @Output() effectRemoved = new EventEmitter<{ relicIndex: number; effectIndex: number }>();

  get relics(): FormArray<FormGroup> {
    return this.tierGroup.get('relics') as FormArray<FormGroup>;
  }

  get passives(): FormArray {
    return this.tierGroup.get('passives') as FormArray;
  }

  effectsFor(relicIndex: number): FormArray {
    return this.relics.at(relicIndex).get('effects') as FormArray;
  }
}
