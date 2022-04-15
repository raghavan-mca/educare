import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlSidebarComponent } from './pl-sidebar.component';

describe('PlSidebarComponent', () => {
  let component: PlSidebarComponent;
  let fixture: ComponentFixture<PlSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
