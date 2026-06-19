import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HunterGuildComponent } from './hunter-guild.component';

describe('HunterGuildComponent', () => {
  let component: HunterGuildComponent;
  let fixture: ComponentFixture<HunterGuildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HunterGuildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HunterGuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
