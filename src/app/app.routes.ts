import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CasketSimulatorComponent } from './casket-simulator/casket-simulator.component';
import { SlayerSimulatorComponent } from './slayer-simulator/slayer-simulator.component';
import { QuestSimulatorComponent } from './quest-simulator/quest-simulator.component';
import { AchievementDiariesComponent } from './achievement-diaries/achievement-diaries.component';
import { CombatAchievementsComponent } from './combat-achievements/combat-achievements.component';
import { HunterGuildComponent } from './hunter-guild/hunter-guild.component';
import { LeagueBuilderComponent } from './league-builder/league-builder.component';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => HomeComponent,
  },

  {
    path: 'about',
    loadComponent: () => AboutComponent,
  },
  {
    path: 'slayer-simulator',
    loadComponent: () => SlayerSimulatorComponent,
  },
  {
    path: 'casket-simulator',
    loadComponent: () => CasketSimulatorComponent,
  },
  {
    path: 'league-builder',
    loadComponent: () => LeagueBuilderComponent,
  },
  {
    path: 'quest-simulator',
    loadComponent: () => QuestSimulatorComponent,
  },
  {
    path: 'achievement-diaries',
    loadComponent: () => AchievementDiariesComponent,
  },
  {
    path: 'combat-achievements',
    loadComponent: () => CombatAchievementsComponent,
  },
  {
    path: 'hunter-guild',
    loadComponent: () => HunterGuildComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
