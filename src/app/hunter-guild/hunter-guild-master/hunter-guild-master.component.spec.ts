import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HunterGuildMasterComponent } from './hunter-guild-master.component';

describe('HunterGuildMasterComponent', () => {
  let component: HunterGuildMasterComponent;
  let fixture: ComponentFixture<HunterGuildMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HunterGuildMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HunterGuildMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
