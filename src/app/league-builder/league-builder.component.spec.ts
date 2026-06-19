import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueBuilderComponent } from './league-builder.component';

describe('LeagueBuilderComponent', () => {
  let component: LeagueBuilderComponent;
  let fixture: ComponentFixture<LeagueBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

