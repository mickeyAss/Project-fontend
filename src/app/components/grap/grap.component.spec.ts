import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrapComponent } from './grap.component';

describe('GrapComponent', () => {
  let component: GrapComponent;
  let fixture: ComponentFixture<GrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
