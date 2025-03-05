import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingService } from '../../../../core/services/billing.service';
import { ServiceBreakdownResponseDto, VisaInvoiceQueryParams } from '../../../../core/models/invoice.models';

@Component({
  selector: 'app-visa-breakdown',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './visa-breakdown.component.html',
  styleUrl: './visa-breakdown.component.scss'
})
export class VisaBreakdownComponent implements OnInit {
  Math = Math;
  invoices: ServiceBreakdownResponseDto[] = [];
  isLoading = false;
  errorMessage = '';
   // Pagination properties
    currentPage = 0;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;
    filterForm: FormGroup;
  
    constructor(
      private billingService: BillingService,
      private fb: FormBuilder,
      private router: Router 
    ) {
      this.filterForm = this.fb.group({
        billingPeriod: [''],
        invoiceId: ['']
      });
    }
    ngOnInit(): void {
      this.loadInvoices();
    }
    loadInvoices(): void {
      this.isLoading = true;
      
      const params: VisaInvoiceQueryParams = {
        page: this.currentPage,
        size: this.pageSize,
        ...this.filterForm.value
      };
      
      // Remove empty string values
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      this.billingService.getVisaServiceBreakdown(params).subscribe({
        next: (data) => {
          if (data && typeof data === 'object' && !Array.isArray(data) &&
                      'content' in data && 'totalElements' in data && 'totalPages' in data) {
                    const paginatedData = data as { content: ServiceBreakdownResponseDto[], totalElements: number, totalPages: number };
                    this.totalElements = paginatedData.totalElements;
                    this.invoices = paginatedData.content;
                    this.totalPages = paginatedData.totalPages;
                  } else {
                    this.invoices = Array.isArray(data) ? data : [];
                    this.totalElements = this.invoices.length;
                  }
                  
                  if (this.invoices.length === 0 && this.currentPage > 0) {
                    this.currentPage--;
                    this.loadInvoices();
                    return;
                  }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading Visa services breakdown:', error);
          this.errorMessage = 'Failed to load breakdown data. Please try again later.';
          this.isLoading = false;
        }
      });
    }
    applyFilter(): void {
      this.currentPage = 0;
      this.loadInvoices();
    }
  
    resetFilter(): void {
      this.filterForm.reset();
      this.currentPage = 0;
      this.loadInvoices();
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.loadInvoices();
    }
  
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.loadInvoices();
      }
    }
  
    nextPage(): void {
      if ((this.currentPage + 1)  < this.totalPages) {
        this.currentPage++;
        this.loadInvoices();
      }
    }
  
    formatCurrency(amount: number | undefined): string {
      if (amount === undefined || amount === null) {
        return '–';
      }
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
  
    formatDate(date: string | undefined): string {
      if (!date) {
        return '–';
      }
      return new Date(date).toLocaleDateString();
    }
   
    navigateToInvoice(): void {
      this.router.navigate(['/invoices/visa']);
    }
    navigateToSummary(): void {
      this.router.navigate(['/invoices/visa/summary']);
    }
    
    navigateToUpload(): void {
      this.router.navigate(['/invoices/visa/upload']);
    }
   

}
