import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-count.component.html',
  styleUrl: './cart-count.component.scss'
})
export class CartCountComponent {
  cartCount$: any;

  constructor(private cartService: CartService) {
    this.cartCount$ = this.cartService.cartCount$;
  }
}
