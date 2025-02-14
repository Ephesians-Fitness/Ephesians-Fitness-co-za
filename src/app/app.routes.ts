import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { ContactUsComponent } from './Pages/contact-us/contact-us.component';
import { ShoppingPageComponent } from './Pages/shopping-page/shopping-page.component';
import { ReviewsComponent } from './Pages/reviews/reviews.component';
import { CartComponent } from './Pages/cart/cart.component';
import { SupportComponent } from './Pages/support/support.component';
import { WorkoutsComponent } from './Pages/workouts/workouts.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { UserOrdersComponent } from './Pages/user-orders/user-orders.component';
import { OrdersComponent } from './Pages/orders/orders.component';
import { RegisterComponent } from './Pages/register/register.component';
import { TermsAndConditionsComponent } from './Pages/terms-and-conditions/terms-and-conditions.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';

import { AuthGuard } from './Authentication/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomePageComponent},
    {path: 'about', component: AboutUsComponent},
    {path: 'contact', component: ContactUsComponent},
    {path: 'shop', component: ShoppingPageComponent},
    {path: 'reviews', component: ReviewsComponent},
    {path: 'cart', component: CartComponent},
    {path: 'support', component: SupportComponent},
    {path: 'workout', component: WorkoutsComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'user-orders', component: UserOrdersComponent},
    {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'terms', component: TermsAndConditionsComponent},
    {path: '**', component: NotFoundComponent},
];
