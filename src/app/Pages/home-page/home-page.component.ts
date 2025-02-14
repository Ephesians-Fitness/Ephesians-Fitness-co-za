import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { products } from '../../Interfaces/products';
import { AboutUsComponent } from "../about-us/about-us.component";
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AboutUsComponent, ContactUsComponent, CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  categories: string[] = [];
  selectedCategory: string = '';
  products: any[] = [];
  displayedProducts: any[] = [];
  currentPage: number = 1;
  productsPerPage: number = 6;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeCategories();
    this.selectedCategory = this.categories[0]; // Default category
    this.filterProducts();
  }

  // Initialize categories from the products array
  initializeCategories() {
    this.categories = products.map((category) => category.title);
  }

  // Filter products based on the selected category
  filterProducts() {
    const category = products.find((cat) => cat.title === this.selectedCategory);
    this.products = category ? category.products : [];
    this.currentPage = 1;  // Reset to page 1
    this.updateDisplayedProducts();
  }

  // Update the displayed products based on pagination
  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  nextPage() {
    const totalPages = Math.ceil(this.products.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  onShop(): void {
    this.router.navigate(['/shop']);
  }

  onProgram(): void {
    this.router.navigate(['/workout']);
  }

  onCustome(): void{
    this.router.navigate(['/custom']);
  }
}
