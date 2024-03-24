import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilescoreComponent } from './profilescore.component';

describe('ProfilescoreComponent', () => {
  let component: ProfilescoreComponent;
  let fixture: ComponentFixture<ProfilescoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilescoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilescoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
