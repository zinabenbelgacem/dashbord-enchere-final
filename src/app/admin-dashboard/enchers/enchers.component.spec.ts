import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnchersComponent } from './enchers.component';

describe('EnchersComponent', () => {
  let component: EnchersComponent;
  let fixture: ComponentFixture<EnchersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnchersComponent]
    });
    fixture = TestBed.createComponent(EnchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
