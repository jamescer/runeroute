import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAllMasters, Assignment } from 'osrs-tools';
import { SessionStatsComponent } from './session-stats/session-stats.component';

@Component({
  selector: 'app-slayer-simulator',
  imports: [CommonModule, FormsModule, SessionStatsComponent],
  templateUrl: './slayer-simulator.component.html',
  styleUrl: './slayer-simulator.component.scss',
})
export class SlayerSimulatorComponent implements OnInit {
  slayerMasters: any[] = [];
  selectedMaster: any | null = null;
  currentTask: any | null = null;
  assignmentCount = 0;
  pointsEarned = 0;
  monstersClaimed = 0;
  totalKills = 0;
  taskHistory: any[] = [];

  ngOnInit(): void {
    this.loadSlayerMasters();
  }

  loadSlayerMasters(): void {
    try {
      this.slayerMasters = getAllMasters() as any[];
    } catch (error) {
      console.error('Error loading slayer masters:', error);
      this.slayerMasters = [];
    }
  }

  selectMaster(master: any): void {
    this.selectedMaster = master;
    this.currentTask = null;
    this.assignmentCount = 0;
    this.pointsEarned = 0;
    this.taskHistory = [];
  }

  assignTask(): void {
    if (!this.selectedMaster) return;

    try {
      const task = this.selectedMaster.getRandomTask?.();
      if (task) {
        const assignment = this.taskToAssignment(task);
        this.currentTask = assignment;
        this.assignmentCount++;
        this.taskHistory.unshift(assignment);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  }

  /**
   * Transform a Task into an Assignment with random quantity
   */
  taskToAssignment(task: any): Assignment {
    const min = task.getAmountMin?.() || task.amountMin || 10;
    const max = task.getAmountMax?.() || task.amountMax || 25;
    const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
    const requirements = task.requirements || [];

    return new Assignment(task.getName?.() || task.name || 'Unknown', quantity, requirements);
  }

  skipTask(): void {
    const skipCost = 30;
    this.pointsEarned = Math.max(0, this.pointsEarned - skipCost);
    this.assignTask();
  }

  completeTask(): void {
    if (!this.currentTask) return;

    const quantity = this.currentTask.getQuantity?.() || this.currentTask.quantity || 0;
    const pointsGain = Math.floor(quantity * 0.8);

    this.pointsEarned += pointsGain;
    this.totalKills += quantity;
    this.monstersClaimed++;

    this.assignTask();
  }

  resetSession(): void {
    this.selectedMaster = null;
    this.currentTask = null;
    this.assignmentCount = 0;
    this.pointsEarned = 0;
    this.monstersClaimed = 0;
    this.totalKills = 0;
    this.taskHistory = [];
  }

  getMasterRequirements(master: any): string {
    if (master.minimumCombatLevel) {
      return `Combat ${master.minimumCombatLevel}`;
    }
    return 'None';
  }

  getTaskName(task: any): string {
    return task?.getName?.() || task?.name || 'Unknown';
  }

  getTaskQuantity(task: any): number {
    return task?.getQuantity?.() || task?.quantity || 0;
  }

  getTaskDifficulty(task: any | null): string {
    if (!task) return 'Easy';
    const quantity = task.getQuantity?.() || task.quantity || 0;
    if (quantity < 50) return 'Easy';
    if (quantity < 100) return 'Medium';
    if (quantity < 150) return 'Hard';
    return 'Very Hard';
  }
}
