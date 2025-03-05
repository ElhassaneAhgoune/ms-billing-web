import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConnexionFollowUpDto } from '../../core/models/auth.models';
import { ConnexionFollowUpQueryParams } from '../../core/models/invoice.models';


@Component({
  selector: 'app-user-follow-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-follow-up.component.html',
  styleUrl: './user-follow-up.component.scss'
})
export class UserFollowUpComponent implements OnInit{
  successMessage = '';
  errorMessage = '';
  
  // Connection follow-up data
  connexionHistory: ConnexionFollowUpDto[] = [];
  isLoading = false;
  connexionError = '';

  Math = Math;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  filterForm: FormGroup;
constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router 
  ) {
    this.filterForm = this.fb.group({
      userName: [''],
      startDate: [''],
      endDate: [''],
      action: ['']
    });
  }
  ngOnInit(): void {
    this.loadConnectionHistory();
  }

  loadConnectionHistory(): void {
    this.isLoading = true;
    this.connexionError = '';
     const params: ConnexionFollowUpQueryParams = {
          page: this.currentPage,
          size: this.pageSize,
          ...this.filterForm.value
        };
        
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
    const sub = this.userService.getConnectionFollowUp(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
        'content' in data && 'totalElements' in data && 'totalPages' in data) {
        const paginatedData = data as { content: ConnexionFollowUpDto[], totalElements: number, totalPages: number };
        this.totalElements = paginatedData.totalElements;
        this.connexionHistory = paginatedData.content;
        this.totalPages = paginatedData.totalPages;
        this.isLoading = false;
         } else{
        this.connexionHistory = data;
        this.isLoading = false;
      }},
      error: (error) => {
        console.error('Error loading connection history:', error);
        this.connexionError = 'Failed to load connection history. Please try again.';
        this.isLoading = false;
      }
    });
  }
  refreshConnectionHistory(): void {
    this.loadConnectionHistory();

  }
  applyFilter(): void {
    this.currentPage = 0; 
    this.loadConnectionHistory();
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadConnectionHistory();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadConnectionHistory();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadConnectionHistory();
    }
  }

  nextPage(): void {
    
    if ((this.currentPage + 1)  < this.totalPages) {
      this.currentPage++;
      this.loadConnectionHistory();
    }
  }
  formatDate(date: string | undefined): string {
    if (!date) {
      return '–';
    }
    return new Date(date).toLocaleDateString();
  }

  navigateToUsers(): void {
    this.router.navigate(['/users-list']);
  }

}
