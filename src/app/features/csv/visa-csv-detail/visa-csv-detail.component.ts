import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingService } from '../../../core/services/billing.service';
import { VisaInvoiceDetailDto, VisaInvoiceQueryParams } from '../../../core/models/invoice.models';
@Component({
  selector: 'app-visa-csv-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './visa-csv-detail.component.html',
  styleUrl: './visa-csv-detail.component.scss'
})
export class VisaCsvDetailComponent implements OnInit{
  Math = Math;
  invoices: VisaInvoiceDetailDto[] = [];
  isLoading = false;
  errorMessage = '';
  
  csvName: string = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  
  filterForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe(params => {
      const csvName = params.get('csvName');
  
      if ( !csvName) {
        this.errorMessage = 'Missing  CSV name';
        return;
      }
  
      this.csvName = csvName;
      this.loadInvoices();
    });
  }
loadInvoices(): void {
    this.isLoading = true;
    
    const params: VisaInvoiceQueryParams = {
      csvName: this.csvName,
      page: this.currentPage,
      size: this.pageSize,
      ...this.filterForm.value
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    
    this.billingService.getVisaInvoices(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
            'content' in data && 'totalElements' in data) {
          const paginatedData = data as { content: VisaInvoiceDetailDto[], totalElements: number, totalPages: number };
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
        console.error('Error loading Visa invoices:', error);
        this.errorMessage = 'Failed to load invoices for ${this.csvName}. Please try again later.';
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

  navigateToCsvList(): void {
    this.router.navigate(['/csv-files']);
  }
  navigateToUpload(): void {
    this.router.navigate(['/invoices/visa/upload']);
  }
}
