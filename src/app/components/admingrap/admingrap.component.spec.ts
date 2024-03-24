import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingrapComponent } from './admingrap.component';

describe('AdmingrapComponent', () => {
  let component: AdmingrapComponent;
  let fixture: ComponentFixture<AdmingrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingrapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
