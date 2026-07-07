import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ALL_COMBAT_ACHIEVEMENT_TASKS,
  CombatAchievementProgress,
  CombatAchievementRewardTier,
  CombatAchievementTask,
  CombatAchievementTier,
  CombatAchievementTool,
  COMBAT_ACHIEVEMENT_REWARD_TIERS,
  COMBAT_ACHIEVEMENT_TIER_POINTS,
} from 'osrs-tools/combat-achievements';
import { RewardTierListComponent } from './reward-tier-list/reward-tier-list.component';

type TierFilter = 'All' | CombatAchievementTier;

@Component({
  selector: 'app-combat-achievements',
  imports: [CommonModule, FormsModule, RewardTierListComponent],
  templateUrl: './combat-achievements.component.html',
  styleUrl: './combat-achievements.component.scss',
})
export class CombatAchievementsComponent implements OnInit {
  private readonly combatAchievementTool = new CombatAchievementTool();

  allTasks: CombatAchievementTask[] = [];
  filteredTasks: CombatAchievementTask[] = [];
  monsters: string[] = [];

  readonly tiers: CombatAchievementTier[] = [
    CombatAchievementTier.Easy,
    CombatAchievementTier.Medium,
    CombatAchievementTier.Hard,
    CombatAchievementTier.Elite,
    CombatAchievementTier.Master,
    CombatAchievementTier.Grandmaster,
  ];

  readonly tierFilters: TierFilter[] = ['All', ...this.tiers];
  readonly rewardTiers: CombatAchievementRewardTier[] = COMBAT_ACHIEVEMENT_REWARD_TIERS;
  readonly tierPoints = COMBAT_ACHIEVEMENT_TIER_POINTS;

  readonly tabIconPaths = {
    combat: 'assets/icons/tabs/Combat_Tab.png',
  };

  selectedTier: TierFilter = 'All';
  selectedMonster = '';
  searchTerm = '';

  private readonly completedTaskNames = new Set<string>();
  progress!: CombatAchievementProgress;

  ngOnInit(): void {
    try {
      this.allTasks = [...ALL_COMBAT_ACHIEVEMENT_TASKS].sort(
        (a, b) => this.tiers.indexOf(a.tier) - this.tiers.indexOf(b.tier) || a.name.localeCompare(b.name),
      );
      this.monsters = [...new Set(this.allTasks.map((task) => task.monster))].sort((a, b) =>
        a.localeCompare(b),
      );
    } catch (error) {
      console.error('Error loading combat achievements:', error);
      this.allTasks = [];
      this.monsters = [];
    }

    this.applyFilters();
    this.recalculateProgress();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredTasks = this.allTasks.filter((task) => {
      const matchesTier = this.selectedTier === 'All' || task.tier === this.selectedTier;
      const matchesMonster = !this.selectedMonster || task.monster === this.selectedMonster;
      const matchesTerm =
        !term ||
        task.name.toLowerCase().includes(term) ||
        task.monster.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);

      return matchesTier && matchesMonster && matchesTerm;
    });
  }

  selectTier(tier: TierFilter): void {
    this.selectedTier = tier;
    this.applyFilters();
  }

  selectMonster(monster: string): void {
    this.selectedMonster = this.selectedMonster === monster ? '' : monster;
    this.applyFilters();
  }

  isCompleted(task: CombatAchievementTask): boolean {
    return this.completedTaskNames.has(task.name.toLowerCase());
  }

  toggleTask(task: CombatAchievementTask): void {
    const key = task.name.toLowerCase();

    if (this.completedTaskNames.has(key)) {
      this.completedTaskNames.delete(key);
    } else {
      this.completedTaskNames.add(key);
    }

    this.recalculateProgress();
  }

  completeAllVisible(): void {
    this.filteredTasks.forEach((task) => this.completedTaskNames.add(task.name.toLowerCase()));
    this.recalculateProgress();
  }

  clearProgress(): void {
    this.completedTaskNames.clear();
    this.recalculateProgress();
  }

  private recalculateProgress(): void {
    this.progress = this.combatAchievementTool.getProgress(this.completedTaskNames);
  }

  get completedCount(): number {
    return this.completedTaskNames.size;
  }

  get totalTasks(): number {
    return this.allTasks.length;
  }

  get totalPointsAvailable(): number {
    return this.allTasks.reduce((sum, task) => sum + task.points, 0);
  }

  get overallPercent(): number {
    return this.totalPointsAvailable === 0
      ? 0
      : Math.round((this.progress.totalPoints / this.totalPointsAvailable) * 100);
  }

  tierProgressPercent(tier: CombatAchievementTier): number {
    const tierProgress = this.progress[tier];
    if (!tierProgress || tierProgress.pointsAvailable === 0) {
      return 0;
    }
    return Math.round((tierProgress.pointsEarned / tierProgress.pointsAvailable) * 100);
  }

  trackByTaskId(_index: number, task: CombatAchievementTask): number {
    return task.id;
  }

  tierClass(tier: CombatAchievementTier | string): string {
    return `tier-${tier.toString().toLowerCase()}`;
  }
}
