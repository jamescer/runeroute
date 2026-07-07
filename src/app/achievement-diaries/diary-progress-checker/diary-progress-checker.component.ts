import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OsrsAccount, Skill } from 'osrs-tools/account';

@Component({
  selector: 'app-diary-progress-checker',
  imports: [CommonModule, FormsModule],
  templateUrl: './diary-progress-checker.component.html',
  styleUrl: './diary-progress-checker.component.scss',
})
export class DiaryProgressCheckerComponent {
  @Output() accountChange = new EventEmitter<OsrsAccount | null>();

  readonly skillList: Skill[] = Object.values(Skill);
  skillLevels: Record<string, number> = Object.fromEntries(
    this.skillList.map((skill) => [skill, 1]),
  );
  questPoints = 0;
  progressCheckerOpen = false;
  account: OsrsAccount | null = null;

  private readonly skillsIconFallback = 'assets/icons/tabs/Skills_Tab.png';

  private readonly skillIconPaths: Record<string, string> = {
    agility: 'assets/icons/skills/Agility_icon.png',
    attack: 'assets/icons/skills/Attack_icon.png',
    construction: 'assets/icons/skills/Construction_icon.png',
    cooking: 'assets/icons/skills/Cooking_icon.png',
    crafting: 'assets/icons/skills/Crafting_icon.png',
    defence: 'assets/icons/skills/Defence_icon.png',
    farming: 'assets/icons/skills/Farming_icon.png',
    firemaking: 'assets/icons/skills/Firemaking_icon.png',
    fishing: 'assets/icons/skills/Fishing_icon.png',
    fletching: 'assets/icons/skills/Fletching_icon.png',
    herblore: 'assets/icons/skills/Herblore_icon.png',
    hitpoints: 'assets/icons/skills/Hitpoints_icon.png',
    hunter: 'assets/icons/skills/Hunter_icon.png',
    magic: 'assets/icons/skills/Magic_icon.png',
    mining: 'assets/icons/skills/Mining_icon.png',
    prayer: 'assets/icons/skills/Prayer_icon.png',
    ranged: 'assets/icons/skills/Ranged_icon.png',
    sailing: 'assets/icons/skills/Sailing_icon.png',
    slayer: 'assets/icons/skills/Slayer_icon.png',
    smithing: 'assets/icons/skills/Smithing_icon.png',
    strength: 'assets/icons/skills/Strength_icon.png',
    thieving: 'assets/icons/skills/Thieving_icon.png',
    woodcutting: 'assets/icons/skills/Woodcutting_icon.png',
  };

  toggleProgressChecker(open: boolean): void {
    this.progressCheckerOpen = open;
    if (open && !this.account) {
      this.refreshAccount();
    }
  }

  refreshAccount(): void {
    const skills: Record<string, { level: number }> = {};
    for (const skill of this.skillList) {
      const level = Math.min(99, Math.max(1, Number(this.skillLevels[skill]) || 1));
      skills[skill] = { level };
    }

    this.account = new OsrsAccount({
      name: 'You',
      questPoints: Math.max(0, Number(this.questPoints) || 0),
      skills,
    });
    this.accountChange.emit(this.account);
  }

  getSkillIconPath(skill: Skill): string {
    const normalized = skill.toLowerCase();
    return this.skillIconPaths[normalized] || this.skillsIconFallback;
  }
}
