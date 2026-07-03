import { Component, EventEmitter, Output, ViewChild, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RelicTierRowComponent } from './relic-tier-row/relic-tier-row.component';
import { PactTreeEditorComponent } from './pact-tree/pact-tree-editor.component';
import type { League, Relic, RelicTier, RewardTier } from 'osrs-tools';

export type LeagueBuilderTab = 'relics' | 'pacts' | 'rewards';

@Component({
  selector: 'app-league-builder',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RelicTierRowComponent, PactTreeEditorComponent],
  templateUrl: './league-builder.component.html',
  styleUrl: './league-builder.component.scss',
})
export class LeagueBuilderComponent {
  private readonly fb = inject(FormBuilder);

  /** Emits a fully-typed League once the form is valid and submitted */
  @Output() leagueCreated = new EventEmitter<League>();

  @ViewChild(PactTreeEditorComponent) pactTreeEditor?: PactTreeEditorComponent;

  readonly activeTab = signal<LeagueBuilderTab>('relics');

  readonly tabs: { id: LeagueBuilderTab; label: string }[] = [
    { id: 'relics', label: 'Relics' },
    { id: 'pacts', label: 'Pacts' },
    { id: 'rewards', label: 'Rewards' },
  ];

  selectTab(tab: LeagueBuilderTab): void {
    this.activeTab.set(tab);
  }

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    xpMultiplier: [1, [Validators.required, Validators.min(1)]],
    dropRateMultiplier: [1, [Validators.required, Validators.min(1)]],
    relicTiers: this.fb.array<FormGroup>([]),
    rewards: this.fb.array<FormGroup>([]),
  });

  get relicTiers(): FormArray<FormGroup> {
    return this.form.get('relicTiers') as FormArray<FormGroup>;
  }

  get rewards(): FormArray<FormGroup> {
    return this.form.get('rewards') as FormArray<FormGroup>;
  }

  // ---------- Relic tiers ----------

  addRelicTier(): void {
    this.relicTiers.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        tier: [this.relicTiers.length + 1, Validators.required],
        name: ['', Validators.required],
        pointThreshold: [0, [Validators.required, Validators.min(0)]],
        passives: this.fb.array<FormControl<string>>([]),
        relics: this.fb.array<FormGroup>([]),
      }),
    );
  }

  removeRelicTier(tierIndex: number): void {
    this.relicTiers.removeAt(tierIndex);
  }

  passivesFor(tierIndex: number): FormArray<FormControl<string>> {
    return this.relicTiers.at(tierIndex).get('passives') as FormArray<FormControl<string>>;
  }

  addPassive(tierIndex: number): void {
    this.passivesFor(tierIndex).push(this.fb.control('', { nonNullable: true, validators: Validators.required }));
  }

  removePassive(tierIndex: number, passiveIndex: number): void {
    this.passivesFor(tierIndex).removeAt(passiveIndex);
  }

  // ---------- Relics (nested inside a tier) ----------

  relicsFor(tierIndex: number): FormArray<FormGroup> {
    return this.relicTiers.at(tierIndex).get('relics') as FormArray<FormGroup>;
  }

  addRelic(tierIndex: number): void {
    this.relicsFor(tierIndex).push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: ['', Validators.required],
        description: [''],
        image: [''],
        effects: this.fb.array<FormControl<string>>([
          this.fb.control('', { nonNullable: true, validators: Validators.required }),
        ]),
      }),
    );
  }

  removeRelic(tierIndex: number, relicIndex: number): void {
    this.relicsFor(tierIndex).removeAt(relicIndex);
  }

  effectsFor(tierIndex: number, relicIndex: number): FormArray<FormControl<string>> {
    return this.relicsFor(tierIndex).at(relicIndex).get('effects') as FormArray<FormControl<string>>;
  }

  addEffect(tierIndex: number, relicIndex: number): void {
    this.effectsFor(tierIndex, relicIndex).push(
      this.fb.control('', { nonNullable: true, validators: Validators.required }),
    );
  }

  removeEffect(tierIndex: number, relicIndex: number, effectIndex: number): void {
    this.effectsFor(tierIndex, relicIndex).removeAt(effectIndex);
  }

  // ---------- Reward tiers ----------

  addReward(): void {
    this.rewards.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: ['', Validators.required],
        description: [''],
        threshold: [0, [Validators.required, Validators.min(0)]],
        image: [''],
      }),
    );
  }

  removeReward(rewardIndex: number): void {
    this.rewards.removeAt(rewardIndex);
  }

  // ---------- Submit ----------

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const league: League = {
      name: raw.name,
      startDate: new Date(raw.startDate),
      endDate: new Date(raw.endDate),
      xpMultiplier: raw.xpMultiplier,
      dropRateMultiplier: raw.dropRateMultiplier,
      pactTree: this.pactTreeEditor?.exportTree(),
      relicTiers: raw.relicTiers.map(
        (tier: any): RelicTier => ({
          id: tier.id,
          tier: tier.tier,
          name: tier.name,
          pointThreshold: tier.pointThreshold,
          passives: tier.passives,
          relics: tier.relics.map(
            (relic: any): Relic => ({
              id: relic.id,
              name: relic.name,
              description: relic.description,
              effects: relic.effects,
              image: relic.image || undefined,
            })
          ),
        })
      ),
      rewards: raw.rewards.map(
        (reward: any): RewardTier => ({
          id: reward.id,
          name: reward.name,
          description: reward.description,
          threshold: reward.threshold,
          image: reward.image || undefined,
        })
      ),
      id: '',
      number: 0,
      theme: ''
    };

    this.leagueCreated.emit(league);
  }
}
