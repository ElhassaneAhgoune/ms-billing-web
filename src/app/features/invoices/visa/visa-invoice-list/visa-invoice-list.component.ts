import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingService } from '../../../../core/services/billing.service';
import { VisaInvoiceDetailDto, VisaInvoiceQueryParams } from '../../../../core/models/invoice.models';

@Component({
  selector: 'app-visa-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './visa-invoice-list.component.html',
  styleUrls: ['./visa-invoice-list.component.scss']
})
export class VisaInvoiceListComponent implements OnInit {
  // Make Math available to the template
  Math = Math;
  invoices: VisaInvoiceDetailDto[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  
  // Filtering form
  filterForm: FormGroup;
  
  constructor(
    private billingService: BillingService,
    private fb: FormBuilder
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
    
    this.billingService.getVisaInvoices(params).subscribe({
      next: (data) => {
        this.invoices = data;
        // If the API returns paginated data in a different format, adjust accordingly
        // this.totalElements = data.totalElements;
        // this.invoices = data.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Visa invoices:', error);
        this.errorMessage = 'Failed to load invoices. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 0; // Reset to first page when applying filters
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
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
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
}