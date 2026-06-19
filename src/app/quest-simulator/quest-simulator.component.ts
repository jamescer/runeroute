import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestTool } from 'osrs-tools';
import { Quest } from 'osrs-tools/quest';
import { RequirementType } from 'osrs-tools/quest';
interface RequirementData {
  skillName?: string;
  skill?: string;
  level?: number;
  requiredLevel?: number;
  skillLevel?: number;
  questName?: string;
  quest?: string;
  name?: string;
  questRequired?: number;
  itemRequired?: boolean;
  item?: unknown;
  itemsRequired?: unknown[];
  [key: string]: any;
}

interface DisplayReward {
  type: 'skill' | 'item' | 'questpoints' | 'money' | 'misc';
  label: string;
  value: string | number;
  icon?: string;
}

@Component({
  selector: 'app-quest-simulator',
  imports: [CommonModule, FormsModule],
  templateUrl: './quest-simulator.component.html',
  styleUrl: './quest-simulator.component.scss',
})
export class QuestSimulatorComponent implements OnInit {
  allQuests: Quest[] = [];
  filteredQuests: Quest[] = [];
  selectedQuest: Quest | null = null;
  searchTerm: string = '';
  questTool = QuestTool;

  public readonly RequirementType = RequirementType;

  readonly skillIconPaths: Record<string, string> = {
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

  readonly tabIconPaths = {
    quest: 'assets/icons/tabs/Quest_Tab.png',
    inventory: 'assets/icons/tabs/Inventory_Tab.png',
    skills: 'assets/icons/tabs/Skills_Tab.png',
  };

  readonly uiIconPaths = {
    bank: 'assets/icons/ui/Bank.png',
    questPoints: 'assets/icons/ui/Quest_Points.png',
    music: 'assets/icons/ui/Music.png',
    settings: 'assets/icons/ui/Settings.png',
  };

  ngOnInit(): void {
    this.loadAllQuests();
  }

  loadAllQuests(): void {
    try {
      const quests = this.questTool.getAllQuests() as Quest[];
      this.allQuests = quests.filter((q) => q && q.name);
      this.filteredQuests = [...this.allQuests];
    } catch (error) {
      console.error('Error loading quests:', error);
      this.allQuests = [];
      this.filteredQuests = [];
    }
  }

  searchQuests(): void {
    if (!this.searchTerm.trim()) {
      this.filteredQuests = [...this.allQuests];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredQuests = this.allQuests.filter((quest) =>
        quest.name.toLowerCase().includes(term),
      );
    }
  }

  selectQuest(quest: Quest): void {
    this.selectedQuest = quest;
  }

  clearSelection(): void {
    this.selectedQuest = null;
  }

  getMiniQuestCount(): number {
    return this.allQuests.filter((quest) => this.isMiniQuest(quest)).length;
  }

  trackByQuestName(_index: number, quest: Quest): string {
    return quest.name;
  }

  getRequirementLabel(req: RequirementData): string {
    const skill = req.skillName ?? req.skill;
    const level = req.level ?? req.requiredLevel ?? req.skillLevel;

    if (skill && level !== undefined && level !== null) {
      return `${this.formatSkillName(skill)} Level ${level}`;
    }

    if (skill) {
      return this.formatSkillName(skill);
    }

    const questName = req.questName ?? req.quest ?? req.name;
    if (questName) {
      return `Quest: ${questName}`;
    }

    if (req.itemRequired || req.item || req.itemsRequired?.length) {
      return 'Item Required';
    }

    return JSON.stringify(req);
  }

  getRequirementIconPath(req: RequirementData): string {
    const skill = req.skillName ?? req.skill;
    if (skill) {
      return this.getSkillIconPath(skill) || this.tabIconPaths.skills;
    }

    if (req.questName ?? req.quest ?? req.name) {
      return this.tabIconPaths.quest;
    }

    if (req.itemRequired || req.item || req.itemsRequired?.length) {
      return this.tabIconPaths.inventory;
    }

    return this.uiIconPaths.settings;
  }

  /**
   * Transform complex rewards object into a displayable array of typed rewards
   */
  getRewardsList(): DisplayReward[] {
    if (!this.selectedQuest?.rewards) return [];

    const rewards: DisplayReward[] = [];
    const rewardObj = this.selectedQuest.rewards as any;

    // Handle skill rewards (experience/xp in specific skills)
    if (rewardObj.experience) {
      Object.entries(rewardObj.experience).forEach(([skill, xp]) => {
        const iconPath =
          this.getSkillIconPath(skill) || this.tabIconPaths.skills;
        rewards.push({
          type: 'skill',
          label: `${this.formatSkillName(skill)} Experience`,
          value: Number(xp),
          icon: iconPath,
        });
      });
    }

    // Handle quest points
    if (rewardObj.questPoints !== undefined && rewardObj.questPoints > 0) {
      rewards.push({
        type: 'questpoints',
        label: 'Quest Points',
        value: Number(rewardObj.questPoints),
        icon: this.uiIconPaths.questPoints,
      });
    }

    // Handle items
    if (rewardObj.items && Array.isArray(rewardObj.items)) {
      rewardObj.items.forEach((item: any) => {
        const name = item.name || item.id || 'Unknown Item';
        const quantity = item.quantity || 1;
        rewards.push({
          type: 'item',
          label: quantity > 1 ? `${name} (x${quantity})` : name,
          value: Number(quantity),
          icon: this.tabIconPaths.inventory,
        });
      });
    }

    // Handle money/coins
    if (rewardObj.coins !== undefined && rewardObj.coins > 0) {
      rewards.push({
        type: 'money',
        label: 'Coins',
        value: Number(rewardObj.coins),
        icon: this.uiIconPaths.bank,
      });
    }

    // Handle other miscellaneous rewards
    const knownKeys = ['experience', 'questPoints', 'items', 'coins'];
    Object.entries(rewardObj).forEach(([key, value]) => {
      if (!knownKeys.includes(key) && value && typeof value === 'object') {
        rewards.push({
          type: 'misc',
          label: this.formatLabel(key),
          value: JSON.stringify(value),
          icon: this.uiIconPaths.music,
        });
      }
    });

    return rewards;
  }

  /**
   * Format skill names for display (e.g., 'attack' -> 'Attack')
   */
  private formatSkillName(skill: string): string {
    return skill
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getSkillIconPath(skillName: string): string | null {
    const normalizedSkill = skillName.toLowerCase().trim().replace(/\s+/g, '_');

    const directMatch = this.skillIconPaths[normalizedSkill];
    if (directMatch) {
      return directMatch;
    }

    const noUnderscoreMatch =
      this.skillIconPaths[normalizedSkill.replace(/_/g, '')];
    return noUnderscoreMatch || null;
  }

  /**
   * Format generic labels for display
   */
  private formatLabel(label: string): string {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Get styling class based on reward type
   */
  getRewardTypeClass(type: string): string {
    return `reward-${type}`;
  }

  isMiniQuest(quest: Quest): boolean {
    return quest['miniquest'] === true;
  }
}
