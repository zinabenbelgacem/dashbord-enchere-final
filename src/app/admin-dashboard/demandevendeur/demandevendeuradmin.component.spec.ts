import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandevendeurAdminComponent } from './demandevendeuradmin.component';



describe('DemandevendeurComponent', () => {
  let component: DemandevendeurAdminComponent;
  let fixture: ComponentFixture<DemandevendeurAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandevendeurAdminComponent]
    });
    fixture = TestBed.createComponent(DemandevendeurAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
