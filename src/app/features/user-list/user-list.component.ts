import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersListDto } from '../../core/models/auth.models';
import { UsersListQueryParams } from '../../core/models/invoice.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
    successMessage = '';
    errorMessage = '';
    usersList: UsersListDto[] = [];
    isLoading = false;
  
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
      });
    }
    ngOnInit(): void {
      this.loadUsersList();
    }
  
    loadUsersList(): void {
      this.isLoading = true;
      this.errorMessage = '';
       const params: UsersListQueryParams = {
            page: this.currentPage,
            size: this.pageSize,
            ...this.filterForm.value
          };
          
          Object.keys(params).forEach(key => {
            if (params[key] === '') {
              delete params[key];
            }
          });
      const sub = this.userService.getUsersList(params).subscribe({
        next: (data) => {
          if (data && typeof data === 'object' && !Array.isArray(data) &&
          'content' in data && 'totalElements' in data && 'totalPages' in data) {
          const paginatedData = data as { content: UsersListDto[], totalElements: number, totalPages: number };
          this.totalElements = paginatedData.totalElements;
          this.usersList = paginatedData.content;
          this.totalPages = paginatedData.totalPages;
          this.isLoading = false;
           } else{
          this.usersList = data;
          this.isLoading = false;
        }},
        error: (error) => {
          console.error('Error loading list of users:', error);
          this.errorMessage = 'Failed to load list of users. Please try again.';
          this.isLoading = false;
        }
      });
    }
    refresh(): void {
      this.loadUsersList();
  
    }
    applyFilter(): void {
      this.currentPage = 0; 
      this.loadUsersList();
    }
  
    resetFilter(): void {
      this.filterForm.reset();
      this.currentPage = 0;
      this.loadUsersList();
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.loadUsersList();
    }
  
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.loadUsersList();
      }
    }
  
    nextPage(): void {
      
      if ((this.currentPage + 1)  < this.totalPages) {
        this.currentPage++;
        this.loadUsersList();
      }
    }
    formatDate(date: string | undefined): string {
      if (!date) {
        return '–';
      }
      return new Date(date).toLocaleDateString();
    }
  
  }
  