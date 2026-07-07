import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CombatAchievementProgress,
  CombatAchievementRewardTier,
  CombatAchievementTier,
} from 'osrs-tools/combat-achievements';

@Component({
  selector: 'app-reward-tier-list',
  imports: [CommonModule],
  templateUrl: './reward-tier-list.component.html',
  styleUrl: './reward-tier-list.component.scss',
})
export class RewardTierListComponent {
  @Input() rewardTiers: CombatAchievementRewardTier[] = [];
  @Input() progress!: CombatAchievementProgress;

  isRewardTierUnlocked(rewardTier: CombatAchievementRewardTier): boolean {
    return this.progress.totalPoints >= rewardTier.pointsRequired;
  }

  pointsUntilNextTier(): number {
    if (!this.progress.nextRewardTier) {
      return 0;
    }
    return this.progress.nextRewardTier.pointsRequired - this.progress.totalPoints;
  }

  trackByRewardTier(_index: number, rewardTier: CombatAchievementRewardTier): string {
    return rewardTier.tier;
  }

  tierClass(tier: CombatAchievementTier | string): string {
    return `tier-${tier.toString().toLowerCase()}`;
  }
}
