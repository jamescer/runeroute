import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slayer-session-stats',
  imports: [CommonModule],
  templateUrl: './session-stats.component.html',
  styleUrl: './session-stats.component.scss',
})
export class SessionStatsComponent {
  @Input() masterName = '';
  @Input() assignmentCount = 0;
  @Input() totalKills = 0;
  @Input() pointsEarned = 0;
  @Output() reset = new EventEmitter<void>();
}
