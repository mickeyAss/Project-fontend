import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdproscoreComponent } from './adproscore.component';

describe('AdproscoreComponent', () => {
  let component: AdproscoreComponent;
  let fixture: ComponentFixture<AdproscoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdproscoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdproscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
