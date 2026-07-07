import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Diary, DiaryTask, DiaryTier, DiaryTool, getAllDiaries } from 'osrs-tools/diary';
import { OsrsAccount } from 'osrs-tools/account';
import { DiaryProgressCheckerComponent } from './diary-progress-checker/diary-progress-checker.component';

type DiaryLevelKey = DiaryTier;

@Component({
  selector: 'app-achievement-diaries',
  imports: [CommonModule, FormsModule, DiaryProgressCheckerComponent],
  templateUrl: './achievement-diaries.component.html',
  styleUrl: './achievement-diaries.component.scss',
})
export class AchievementDiariesComponent implements OnInit {
  allDiaries: Diary[] = [];
  filteredDiaries: Diary[] = [];
  selectedDiary: Diary | null = null;
  readonly levels: DiaryLevelKey[] = ['easy', 'medium', 'hard', 'elite'];

  searchTerm = '';
  selectedLevel: DiaryLevelKey = 'easy';

  private readonly diaryTool = new DiaryTool();
  account: OsrsAccount | null = null;

  private readonly diaryIconMap: Record<string, string> = {
    'Ardougne Diary': 'Ardougne_Diary.png',
    'Desert Diary': 'Desert_Diary.png',
    'Falador Diary': 'Falador_Diary.png',
    'Fremennik Diary': 'Fremennik_Diary.png',
    'Kandarin Diary': 'Kandarin_Diary.png',
    'Karamja Diary': 'Karamja_Diary.png',
    'Morytania Diary': 'Morytania_Diary.png',
    'Varrock Diary': 'Varrock_Diary.png',
    'Wilderness Diary': 'Wilderness_Diary.png',
  };

  readonly tabIconPaths = {
    quest: 'assets/icons/tabs/Quest_Tab.png',
  };

  readonly levelIconPaths: Record<DiaryLevelKey, string> = {
    easy: 'assets/icons/skills/Agility_icon.png',
    medium: 'assets/icons/skills/Strength_icon.png',
    hard: 'assets/icons/skills/Defence_icon.png',
    elite: 'assets/icons/skills/Slayer_icon.png',
  };

  ngOnInit(): void {
    this.loadDiaries();
  }

  loadDiaries(): void {
    try {
      this.allDiaries = getAllDiaries()
        .filter((diary) => diary && diary.name)
        .sort((a, b) => a.name.localeCompare(b.name));

      this.filteredDiaries = [...this.allDiaries];
      this.selectedDiary = this.allDiaries[0] || null;
    } catch (error) {
      console.error('Error loading achievement diaries:', error);
      this.allDiaries = [];
      this.filteredDiaries = [];
      this.selectedDiary = null;
    }
  }

  searchDiaries(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredDiaries = !term
      ? [...this.allDiaries]
      : this.allDiaries.filter((diary) => diary.name.toLowerCase().includes(term));

    if (
      this.selectedDiary &&
      !this.filteredDiaries.some((diary) => diary.name === this.selectedDiary?.name)
    ) {
      this.selectedDiary = this.filteredDiaries[0] || null;
    }
  }

  selectDiary(diary: Diary): void {
    this.selectedDiary = diary;
  }

  selectLevel(level: DiaryLevelKey): void {
    this.selectedLevel = level;
  }

  getSelectedLevelData() {
    if (!this.selectedDiary) {
      return null;
    }

    return this.selectedDiary[this.selectedLevel] || null;
  }

  getTaskCount(diary: Diary, level: DiaryLevelKey): number {
    return diary[level]?.tasks?.length || 0;
  }

  getTotalTasks(diary: Diary): number {
    return this.getTaskCount(diary, 'easy') + this.getTaskCount(diary, 'medium') + this.getTaskCount(diary, 'hard') + this.getTaskCount(diary, 'elite');
  }

  getAllTaskCount(): number {
    return this.allDiaries.reduce((total, diary) => total + this.getTotalTasks(diary), 0);
  }

  trackByDiaryName(_index: number, diary: Diary): string {
    return diary.name;
  }

  getDiaryIconPath(diaryName: string): string {
    const icon = this.diaryIconMap[diaryName];
    return icon ? `assets/icons/diaries/${icon}` : this.tabIconPaths.quest;
  }

  getLevelIconPath(level: DiaryLevelKey): string {
    return this.levelIconPaths[level];
  }

  formatLevel(level: DiaryLevelKey): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  isTaskReady(task: DiaryTask): boolean {
    return !!this.account && this.diaryTool.canCompleteTask(task, this.account);
  }

  getReadyCount(diary: Diary, level: DiaryLevelKey): number {
    if (!this.account) {
      return 0;
    }
    return diary[level].tasks.filter((task) => this.diaryTool.canCompleteTask(task, this.account!)).length;
  }
}
