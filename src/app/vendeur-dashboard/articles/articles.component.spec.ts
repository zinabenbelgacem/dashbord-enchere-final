import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesVendeurComponent } from './articles.component';



describe('ArticlesVendeurComponent', () => {
  let component: ArticlesVendeurComponent;
  let fixture: ComponentFixture<ArticlesVendeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesVendeurComponent]
    });
    fixture = TestBed.createComponent(ArticlesVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
