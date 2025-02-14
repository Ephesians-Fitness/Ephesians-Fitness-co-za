import { ChangeDetectorRef, Component } from '@angular/core';
import { AboutUsComponent } from "../about-us/about-us.component";
import { ReviewsComponent } from "../reviews/reviews.component";
import { CartCountComponent } from "../cart-count/cart-count.component";
import { Router } from '@angular/router';
import { products, updateProductPrices } from '../../Interfaces/products';
import { CartService } from '../../Services/cart.service';
import { CsvService } from '../../Services/csv.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [AboutUsComponent, ReviewsComponent, CartCountComponent, CommonModule, FormsModule],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.scss'
})
export class ShoppingPageComponent {
  categories: string[] = [];
  selectedCategory: any;
  products: any[] = [];
  displayedProducts: any[] = [];
  currentPage: number = 1;
  productsPerPage: number = 6;

  productCategories = products;
  showNotification: boolean | undefined;

  private productIndices: { [key: string]: number } = {};
  selectedOptions: { [key: string]: any } = {};
  selectedQuantity: number = 1;

  constructor(
    private router: Router,
    private csvService: CsvService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.productCategories.forEach((category) => {
      this.productIndices[category.title] = 0;
      category.products.forEach((product) => {
        this.selectedOptions[product.name] = {
          size: product.availableSizes[0],
          type: product.availableTypes[0],
          color: product.availableColors[0],
        };
      });
    });
    this.selectedCategory = this.productCategories[0] || null;
  }

  ngOnInit(): void {
    this.initializeCategories();
    this.selectedCategory = this.categories[0]; // Default category
    this.filterProducts();

    updateProductPrices(this.csvService, this.productCategories);

    // Set default values for each product
    this.products.forEach((product) => {
      product.selectedSize = product.availableSizes[0]; // Set first size as default
      product.selectedType = product.availableTypes[0]; // Set first type as default
      product.selectedColor = product.availableColors[0]; // Set first color as default
    });
  }

  // Initialize categories from the products array
  initializeCategories() {
    this.categories = products.map((category) => category.title);
  }

  // Filter products based on the selected category
  filterProducts() {
    const category = products.find(
      (cat) => cat.title === this.selectedCategory
    );
    this.products = category ? category.products : [];
    this.currentPage = 1; // Reset to page 1
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

  getCurrentPage(category: any): number {
    return Math.floor(this.productIndices[category.title] / 3) + 1;
  }

  getTotalPages(category: any): number {
    return Math.ceil(category.products.length / 3);
  }

  //#region "Product Selection & Cart Functions."
  addToCart(
    product: any,
    selectedOptions: { size: string; color: string; type?: string },
    quantity: number
  ) {
    const { size, color, type } = selectedOptions;
    this.cartService.addToCart(product, quantity, size, color, type);

    alert('Product added to cart!');
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges(); // Force Angular to update UI
    }, 3000);
  }

  onViewCart(): void {
    this.router.navigate(['/cart']);
  }
  //#endregion.
}
