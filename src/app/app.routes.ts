import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'slayer-simulator',
    loadComponent: () =>
      import('./slayer-simulator/slayer-simulator.component').then((m) => m.SlayerSimulatorComponent),
  },
  {
    path: 'casket-simulator',
    loadComponent: () =>
      import('./casket-simulator/casket-simulator.component').then((m) => m.CasketSimulatorComponent),
  },
  {
    path: 'league-builder',
    loadComponent: () =>
      import('./league-builder/league-builder.component').then((m) => m.LeagueBuilderComponent),
  },
  {
    path: 'quest-simulator',
    loadComponent: () =>
      import('./quest-simulator/quest-simulator.component').then((m) => m.QuestSimulatorComponent),
  },
  {
    path: 'achievement-diaries',
    loadComponent: () =>
      import('./achievement-diaries/achievement-diaries.component').then(
        (m) => m.AchievementDiariesComponent,
      ),
  },
  {
    path: 'combat-achievements',
    loadComponent: () =>
      import('./combat-achievements/combat-achievements.component').then(
        (m) => m.CombatAchievementsComponent,
      ),
  },
  {
    path: 'hunter-guild',
    loadComponent: () =>
      import('./hunter-guild/hunter-guild.component').then((m) => m.HunterGuildComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
