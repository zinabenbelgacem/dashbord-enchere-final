import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/category';
import { CategoriesService } from 'src/app/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  //images: string[] = ['assets/33.jpg', 'assets/15.jpg', 'assets/36.jpg'];
currentImageIndex: number = 0;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.rotateCategories();
      },
      error: (error) => console.error(error),
    });
  }

  rotateCategories() {
    setInterval(() => {
      this.changeRandomImage();
    }, 5000); // Rotation toutes les 5 secondes
  }

  changeRandomImage() {
    const randomIndex = Math.floor(Math.random() * this.categories.length);
    this.currentImageIndex = randomIndex;
  }
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.categories.length;
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.categories.length) % this.categories.length;
  }
}
