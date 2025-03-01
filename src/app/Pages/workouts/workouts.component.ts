import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [PopupMessageComponent, CommonModule, FormsModule],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss'
})
export class WorkoutsComponent {
  showPopup: boolean = false;
  @ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;

  private workoutProgramIndex: number = 0;
  workoutProgramsPerPage: number = 3;

  private coachingProgramIndex: number = 0;
  coachingProgramsPerPage: number = 3;

  formData = {
    name: '',
    email: '',
    goals: ''
  };

  emailFocused = false;

  // serverHost: string = 'http://localhost:3000';
serverHost: string = 'https://ephesians-fitness-server.onrender.com';
  //#endregion.

  //#region "Programs."
 workoutPrograms = [
    { id: 1, title: 'Full Body Strength (Weights)', description: 'A 3-day full body routine focused on building strength using compound lifts.' },
    { id: 2, title: 'Push/Pull/Legs Split (Weights)', description: 'A 6-day split program targeting specific muscle groups each day for maximum hypertrophy.' },
    { id: 3, title: 'Upper/Lower Split (Weights)', description: 'A 4-day upper and lower body split to balance strength and muscle growth.' },
    { id: 4, title: 'Powerlifting Program (Weights)', description: 'A 5-day powerlifting-focused program with heavy compound lifts for strength gains.' },
    { id: 5, title: 'Hypertrophy Circuit (Weights)', description: 'A 3-day muscle-building circuit with high-rep ranges to boost size and endurance.' },
  
    { id: 6, title: 'Bodyweight Strength Routine', description: 'A 4-day bodyweight workout for strength endurance and core stability.' },
    { id: 7, title: 'Calisthenics Program', description: 'A 5-day advanced body control workout using bodyweight exercises like muscle-ups and pistol squats.' },
    { id: 8, title: 'Full Body Bodyweight Program', description: 'A 3-day program focusing on bodyweight exercises for full-body endurance.' },

    { id: 9, title: 'HIIT Sprint Program (Cardio)', description: 'A 3-day high-intensity sprint routine to improve speed and endurance.' },
    { id: 10, title: 'Cardio Endurance Program', description: 'A 5-day steady-state cardio program aimed at building long-term endurance with running, cycling, and rowing.' }
];

  coachingPrograms = [
    { id: 1, title: 'Field Hockey Program', description: 'Field Hockey program for all ages.' },
    { id: 2, title: 'Rugby program', description: 'Rugby program for under 13 and below.' },
    { id: 3, title: 'Long-Distance Athletics Program', description: 'Boost endurance with intense cardio.' }
  ];
  //#endregion

  constructor(private http: HttpClient, private router: Router) {
    this.workoutProgramIndex = 0;
    this.coachingProgramIndex = 0;
  }

  //#region "Workout & Coaching programs display."
  //Workouts.
  getVisibleWorkoutPrograms(): any[]{
    const startIndex = this.workoutProgramIndex;
    return this.workoutPrograms.slice(startIndex, startIndex + this.workoutProgramsPerPage);
  }

  nextWorkoutProgram(): void{
    const totalPrograms = this.workoutPrograms.length;
    this.workoutProgramIndex = (this.workoutProgramIndex + this.workoutProgramsPerPage) % totalPrograms;
  }

  prevWorkoutProgram(): void{
    const totalPrograms = this.workoutPrograms.length;
    this.workoutProgramIndex = (this.workoutProgramIndex - this.workoutProgramsPerPage + totalPrograms) % totalPrograms;
  }

  getCurrentWorkoutPage(): number{
    return Math.floor(this.workoutProgramIndex / this.workoutProgramsPerPage) + 1;
  }

  getTotalWorkoutPages(): number{
    return Math.ceil(this.workoutPrograms.length / this.workoutProgramsPerPage);
  }

  //Coach
  getVisibleCoachPrograms(): any[]{
    const startIndex = this.coachingProgramIndex;
    return this.coachingPrograms.slice(startIndex, startIndex + this.coachingProgramsPerPage);
  }

  nextCoachProgram(): void{
    const totalPrograms = this.coachingPrograms.length;
    this.coachingProgramIndex = (this.coachingProgramIndex + this.coachingProgramsPerPage) % totalPrograms;
  }

  prevCoachProgram(): void{
    const totalPrograms = this.coachingPrograms.length;
    this.coachingProgramIndex = (this.coachingProgramIndex - this.coachingProgramsPerPage + totalPrograms) % totalPrograms;
  }

  getCurrentCoachPage(): number{
    return Math.floor(this.coachingProgramIndex / this.coachingProgramsPerPage) + 1;
  }

  getTotalCoachPages(): number{
    return Math.ceil(this.coachingPrograms.length / this.coachingProgramsPerPage);
  }
  //#endregion.

  //#region "Download Programs."
  // Navigate to a specific program's detailed page
  viewWorkoutProgram(programId: number): void {
    const fileUrl = this.getWorkoutFileUrl(programId);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = this.getWorkoutFileName(programId);
    link.click();
  }

  getWorkoutFileUrl(programId: number): string{
    switch(programId){
      case 1: return '/training/Full-Body-Strength.pdf';
      case 2: return '/training/PPL-Gym-Split.pdf';
      case 3: return '/training/Upper-Lower-Split.pdf';
      case 4: return '/training/Powerlifting.pdf';
      case 5: return '/training/Hypertrophy-Circuit.pdf';
      case 6: return '/training/Bodyweight-Strength.pdf';
      case 7: return '/training/Calisthenics.pdf';
      case 8: return '/training/Full-Body-Bodyweight.pdf';
      case 9: return '/training/HIIT-Sprint-Cardio.pdf';
      case 10: return '/training/Cardio-Endurance.pdf';
      default: return '/training/PPL-Gym-Split.pdf';
    }
  }

  getWorkoutFileName(programId: number): string{
    switch(programId) {
      case 1: return 'Full-Body-Strength.pdf';
      case 2: return 'PPL-Gym-Split.pdf';
      case 3: return 'Upper-Lower-Split.pdf';
      case 4: return 'Powerlifting.pdf';
      case 5: return 'Hypertrophy-Circuit.pdf';
      case 6: return 'Bodyweight-Strength.pdf';
      case 7: return 'Calisthenics.pdf';
      case 8: return 'Full-Body-Bodyweight.pdf';
      case 9: return 'HIIT-Sprint-Cardio.pdf';
      case 10: return 'Cardio-Endurance.pdf';
      default: return 'PPL-Gym-Split.pdf';
    }
  }

  viewCoachingProgram(coachingId: number): void {
    const fileUrl = this.getCoachingFileUrl(coachingId);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = this.getCoachingFileName(coachingId);
    link.click();
  }

  getCoachingFileUrl(coachingId: number): string{
    switch(coachingId){
      case 1: return 'assets/training/Field-Hockey-1.pdf';
      case 2: return 'assets/training/Rugby-2.pdf';
      case 3: return 'assets/training/Long-Distance-Athletics-3.pdf';
      default: return 'assets/training/Coaching-1.pdf';
    }
  }

  getCoachingFileName(coachingId: number): string{
    switch(coachingId) {
      case 1: return 'Field-Hockey-1.pdf';
      case 2: return 'Rugby-2.pdf';
      case 3: return 'Long-Distance-Athletics-3.pdf';
      default: return 'Coaching-1.pdf';
    }
  }
  //#endregion

  //#region "Request for personal program."
  
  onEmailFocus() {
    this.emailFocused = true;
  }
  
  // Handle form submission to request a personalized workout
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const { name, email, goals } = this.formData;
      const requestData = { name, email, goals };

      this.http.post<{ message: string }>(`${this.serverHost}/request-workout`, requestData)
        .subscribe({
          next: (response) => {
            this.popup.show('Workout request sent successfully!');
            // alert(response.message);
            form.reset();
          },
          error: (error) => {
            this.popup.show('Failed to send workout request. Error:');
            
            if (error.error && error.error.message) {
              alert(error.error.message);
            } else {
              this.popup.show('There was an error sending your request. Please try again later.'); // General error message
            }
          }
        });
    } else {
      this.popup.show('Please fill in all required fields.');
    }
  }
  //#endregion

  //Home Page Navigation.
  onHome(): void{
    this.router.navigate(['/home-page']);
  }
  //Products Page Navigation.
  onShop(): void{
    this.router.navigate(['/shop']);
  }
}
