import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingService } from '../../../../core/services/billing.service';
import { MastercardInvoiceDetailDto, MastercardInvoiceQueryParams } from '../../../../core/models/invoice.models';

@Component({
  selector: 'app-mastercard-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mastercard-invoice-list.component.html',
  styleUrls: ['./mastercard-invoice-list.component.scss']
})
export class MastercardInvoiceListComponent implements OnInit {
  Math = Math;
  invoices: MastercardInvoiceDetailDto[] = [];
  isLoading = false;
  errorMessage = '';
  
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  private readonly exportColumns: string[] = [
    'invoiceNumber',
    'billingCycleDate',
    'activityIca',
    'eventId',
    'eventDescription',
    'totalCharge',
    'currency'
  ];

  filterForm: FormGroup;
  
  constructor(
    private billingService: BillingService,
    private fb: FormBuilder,
    private router: Router 
  ) {
    this.filterForm = this.fb.group({
      billingDate: [''],
      invoiceNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    
    const params: MastercardInvoiceQueryParams = {
      page: this.currentPage,
      size: this.pageSize,
      startDate: this.filterForm.value.billingDate,
      ...this.filterForm.value
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    
    this.billingService.getMastercardInvoices(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
            'content' in data && 'totalElements' in data) {
          const paginatedData = data as { content: MastercardInvoiceDetailDto[], totalElements: number, totalPages: number };
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
        console.error('Error loading Mastercard invoices:', error);
        this.errorMessage = 'Failed to load invoices. Please try again later.';
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
  navigateToSummary(): void {
    this.router.navigate(['/invoices/mastercard/summary']);
  }

  navigateToBreakdown(): void {
    this.router.navigate(['/invoices/mastercard/breakdown']);
  }

  navigateToUpload(): void {
    this.router.navigate(['/invoices/mastercard/upload']);
  }
 
  exportToCsv(): void {
    console.log('Exporting Mastercard invoices to CSV...');
    
    const params = this.getFilterParams();
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.billingService.getMastercardInvoices(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
        'content' in data && 'totalElements' in data) {
        const paginatedData = data as { content: MastercardInvoiceDetailDto[], totalElements: number, totalPages: number };
        // Convert data to CSV
        const csv = this.convertToCsv(paginatedData .content);
        console.log('CSV data:', csv);
        this.downloadCsv(csv, 'mastercard-invoices.csv');
      }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to export Mastercard invoices. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private convertToCsv(data: MastercardInvoiceDetailDto[]): string {
    if (!data || data.length === 0) {
      return '';
    }
    
    const headers = this.exportColumns;
    
    const headerRow = headers.map(header => `"${this.getColumnDisplayName(header)}"`).join(',');
    
    const dataRows = data.map(item => {
      return headers.map(header => {
        const value = item[header as keyof MastercardInvoiceDetailDto];
          return `"${value || ''}"`;
       
      }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
  }


  private downloadCsv(csv: string, filename: string): void {
    if (!csv) {
      this.errorMessage = 'No data to export';
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } 

  getFilterParams(): MastercardInvoiceQueryParams & { page: number, size: number } {
    const params: any = {
      page: 0,
      size: this.totalElements,
      ...this.filterForm.value
    };

    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    return params;
  }

  getColumnDisplayName(column: string): string {
    const columnMappings: Record<string, string> = {
      invoiceNumber: 'Invoice Number',
      billingCycleDate: 'Billing Cycle Date',
      activityIca: 'Activity ICA',
      eventId: 'Event ID',
      eventDescription: 'Event Description',
      totalCharge: 'Total Charge',
      currency: 'Currency'
    };
    return columnMappings[column] || column;
  }
}