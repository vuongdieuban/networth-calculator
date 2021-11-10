import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworthTableComponent } from './networth-table.component';

describe('NetworthTableComponent', () => {
  let component: NetworthTableComponent;
  let fixture: ComponentFixture<NetworthTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworthTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworthTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
