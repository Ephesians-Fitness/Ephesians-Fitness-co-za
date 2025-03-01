import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewParameters } from '../../Parameters/ReviewParameters';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { Papa } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopupMessageComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  //#region "Global Variabels."
reviewForm: FormGroup;
showPopup: boolean = false;
showOrderNumberField = false;
emailFocused = false;

@ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;

reviews: ReviewParameters[] = []; 
paginatedReviews: ReviewParameters[] = [];
currentPage: number = 0;
pageSize: number = 3;
currentDate: Date = new Date();

// serverHost: string = 'http://localhost:3000';
serverHost: string = 'https://ephesians-fitness-server.onrender.com';

//#endregion.

onEmailFocus() {
  this.emailFocused = true;
}

constructor(private fb: FormBuilder, private http: HttpClient, private papa: Papa) {
  
  this.reviewForm = this.fb.group({
    cartid: [''], 
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required]
  });
}

ngOnInit(): void {
  this.getReviews();
}

//#region "Load reviews from DB."
getReviews() {
  this.http.get('files/Reviews.csv', { responseType: 'text' }).subscribe({
    next: (data: string) => {
      // Parse CSV data
      this.papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.reviews = result.data.map((review: any) => ({
            Name: review.Name,
            Rating: review.Rating,
            Comment: review.Comment,
            Email: review.Email,
          })) as ReviewParameters[];

          this.updatePaginatedReviews(); // Assuming you still want to update pagination.
        },
      });
    },
    error: () => {
      this.popup.show('Error fetching reviews from CSV. Please try again later.');
    },
  });
}
//#endregion

//#region "Display review based on Page numbers."
updatePaginatedReviews() {
  const startIndex = this.currentPage * this.pageSize;
  this.paginatedReviews = this.reviews.slice(startIndex, startIndex + this.pageSize);
}

prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePaginatedReviews();
  }
}


nextPage() {
  if (this.currentPage < Math.floor(this.reviews.length / this.pageSize)) {
    this.currentPage++;
    this.updatePaginatedReviews();
  }
}


get totalPages() {
  return Math.ceil(this.reviews.length / this.pageSize);
}
//#endregion.

//#region "Review Submission."
//This will display based on the rating you provided.
checkRating() {
  this.showOrderNumberField = this.reviewForm.get('rating')?.value < 3;
}

submitReview() {
  if (this.reviewForm.invalid) {
    this.popup.show('Please fill in all required fields.');
    return;
  }

  const newReview: ReviewParameters = {
    Name: this.reviewForm.get('name')?.value,
    Rating: this.reviewForm.get('rating')?.value,
    Comment: this.reviewForm.get('comment')?.value,
    ReviewDate: this.currentDate,
    Email: this.reviewForm.get('email')?.value
  };

  this.http.post(`${this.serverHost}/add-review`, newReview).subscribe({
    next: () => {
      this.reviewForm.reset();
      this.popup.show('Review submitted successfully!');
      this.getReviews();

      this.sendReviewEmail(newReview);
    },
    error: () => {
      this.popup.show('Error inserting review. Please try again later.');
    }
  });
}

// Function to send review email
sendReviewEmail(review: ReviewParameters) {
  const emailData = {
    name: review.Name,
    email: review.Email,
    comment: review.Comment,
    rating: review.Rating,
    cartid: "N/A" // You might need to pass a valid cart ID if applicable
  };

  this.http.post(`${this.serverHost}/send-review-email`, emailData).subscribe({
    next: () => {
      this.popup.show('Review email sent successfully!');
    },
    error: () => {
      this.popup.show('Failed to send review email.');
    }
  });
}
//#endregion.
}
