import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandevendeurComponent } from './demandevendeur.component';

describe('DemandevendeurComponent', () => {
  let component: DemandevendeurComponent;
  let fixture: ComponentFixture<DemandevendeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandevendeurComponent]
    });
    fixture = TestBed.createComponent(DemandevendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
