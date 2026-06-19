import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HunterGuild, HunterGuildMaster, HunterRumour } from 'osrs-tools';
import { HunterGuildMasterComponent } from './hunter-guild-master/hunter-guild-master.component';

@Component({
  selector: 'app-hunter-guild',
  imports: [CommonModule, FormsModule, HunterGuildMasterComponent],
  templateUrl: './hunter-guild.component.html',
  styleUrls: ['./hunter-guild.component.scss'],
})
export class HunterGuildComponent {
  private hunterGuild = new HunterGuild();

  hunterLevel = 99;
  hasAtFirstLight = true;
  masters: HunterGuildMaster[] = this.hunterGuild.getAllMasters();
  assignmentErrors: Record<string, string> = {};

  get completedQuests(): string[] {
    return this.hasAtFirstLight ? ['At First Light'] : [];
  }

  getEligibleRumours(master: HunterGuildMaster): HunterRumour[] {
    const currentRumour = this.getCurrentRumour(master);
    const eligibleRumours = this.hunterGuild.getEligibleRumours(
      master.name,
      this.hunterLevel,
      this.completedQuests,
    );

    if (!currentRumour) {
      return eligibleRumours;
    }

    return [currentRumour, ...eligibleRumours];
  }

  getPossibleRumours(master: HunterGuildMaster): HunterRumour[] {
    return this.hunterGuild.getEligibleRumours(
      master.name,
      this.hunterLevel,
      this.completedQuests,
    );
  }

  getCurrentRumour(master: HunterGuildMaster): HunterRumour | null {
    if (!master.currentRumourId) {
      return null;
    }

    return this.hunterGuild.getRumourById(master.currentRumourId) ?? null;
  }

  assignSelectedRumour(master: HunterGuildMaster, rumourId: string): void {
    this.assignmentErrors[master.name] = '';

    if (!rumourId) {
      this.hunterGuild.setMasterCurrentRumour(master.name, '');
      return;
    }

    this.hunterGuild.assignRumourToMaster(master.name, rumourId);
  }

  getRumour(master: HunterGuildMaster): void {
    this.assignmentErrors[master.name] = '';

    const assignment = this.hunterGuild.assignRumour(
      master.name,
      this.hunterLevel,
      this.completedQuests,
    );

    if (!assignment) {
      this.assignmentErrors[master.name] =
        'No eligible rumours are available for this master.';
      return;
    }

    this.hunterGuild.assignRumourToMaster(master.name, assignment.rumourId);
  }
}
