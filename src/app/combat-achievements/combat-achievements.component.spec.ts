import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatAchievementsComponent } from './combat-achievements.component';

describe('CombatAchievementsComponent', () => {
  let component: CombatAchievementsComponent;
  let fixture: ComponentFixture<CombatAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombatAchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CombatAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
