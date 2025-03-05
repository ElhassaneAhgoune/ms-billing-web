import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  Math = Math;
  invoices: VisaInvoiceDetailDto[] = [];
  isLoading = false;
  errorMessage = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  private readonly visaExportColumns: string[] = [
    'invoiceId',
    'billingPeriod',
    'invoiceDate',
    'entityName',
    'description',
    'total',
    'billingCurrency'
  ];
  

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
    if ((this.currentPage + 1) < this.totalPages) {
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

  navigateToUpload(): void {
    this.router.navigate(['/invoices/visa/upload']);
  }
  navigateToSummary(): void {
    this.router.navigate(['/invoices/visa/summary']);
  }

  navigateToBreakdown(): void {
    this.router.navigate(['/invoices/visa/breakdown']);
  }


  exportToVisaCsv(): void {
    console.log('Exporting Visa invoices to CSV...');
    
    const params = this.getFilterParams(); 
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.billingService.getVisaInvoices(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
          'content' in data && 'totalElements' in data) {
          const paginatedData = data as { content: VisaInvoiceDetailDto[], totalElements: number, totalPages: number };
          const csv = this.convertVisaToCsv(paginatedData.content);
          console.log('CSV data:', csv);
          this.downloadCsv(csv, 'visa-invoices.csv');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to export Visa invoices. Please try again later.';
        this.isLoading = false;
      }
    });
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

  private convertVisaToCsv(data: VisaInvoiceDetailDto[]): string {
    if (!data || data.length === 0) {
      return '';
    }
  
    const headers = this.visaExportColumns;
    const headerRow = headers.map(header => `"${this.getVisaColumnDisplayName(header)}"`).join(',');
  
    const dataRows = data.map(item => {
      return headers.map(header => {
        const value = item[header as keyof VisaInvoiceDetailDto];
          return `"${value || ''}"`;
      }).join(',');
    });
  
    return [headerRow, ...dataRows].join('\n');
  }

  getFilterParams(): VisaInvoiceQueryParams & { page: number, size: number } {
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

  getVisaColumnDisplayName(column: string): string {
    const columnMappings: Record<string, string> = {
      invoiceId: 'Invoice ID',
      billingPeriod: 'Billing Period',
      invoiceDate: 'Invoice Date',
      entityName: 'Entity Name',
      description: 'Description',
      total: 'Total Amount',
      billingCurrency: 'Currency'
    };
    return columnMappings[column] || column;
  }
  
}
