import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingService } from '../../../../core/services/billing.service';
import { VisaInvoiceDetailDto } from 'src/app/core/models/invoice.models';
@Component({
  selector: 'app-mastercard-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mastercard-summary.component.html',
  styleUrls: ['./mastercard-summary.component.scss']
})
export class MastercardSummaryComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
 // Pagination properties
   currentPage = 0;
   pageSize = 10;
   totalElements = 0;
   totalPages = 0;
  
  // Summary data
  totalInvoices = 0;
  totalAmount = 0;
  paidInvoices = 0;
  pendingInvoices = 0;
  monthlySummary: any[] = [];
  
  // Filtering form
  filterForm: FormGroup;
  
  constructor(
    private billingService: BillingService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      year: [new Date().getFullYear()],
      month: ['']
    });
  }

  ngOnInit(): void {
    this.loadSummaryData();
  }

  loadSummaryData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const params = {
      ...this.filterForm.value
    };
    
    // Remove empty string values
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    
    // In a real app, you would have an API endpoint for summary data
    this.billingService.getVisaInvoices(params).subscribe({
      next: (data) => {
         if (data && typeof data === 'object' && !Array.isArray(data) &&
                              'content' in data && 'totalElements' in data && 'totalPages' in data) {
                             
                 const paginatedData = data as { content: VisaInvoiceDetailDto[], totalElements: number, totalPages: number };
                // Process the data to create summary information
                console.log(paginatedData.content);
                this.totalInvoices = paginatedData.content.length;
                this.totalAmount = paginatedData.content.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
                // Count invoices by billing type or other categorization
                const processedInvoices = paginatedData.content.filter(invoice => invoice.type === 'Processed').length;
                this.paidInvoices = processedInvoices;
                this.pendingInvoices = this.totalInvoices - processedInvoices;
                
                // Create monthly data summary
                this.createMonthlySummary(paginatedData.content);
              } else {
        // Process the data to create summary information
        this.totalInvoices = data.length;
        this.totalAmount = data.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
        // Count invoices by billing type or other categorization
        const processedInvoices = data.filter(invoice => invoice.type === 'Processed').length;
        this.paidInvoices = processedInvoices;
        this.pendingInvoices = this.totalInvoices - processedInvoices;
        
        // Create monthly data summary
        this.createMonthlySummary(data);
              }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading summary data:', error);
        this.errorMessage = 'Failed to load summary data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  createMonthlySummary(data: any[]): void {
    // Group by month
    const monthlyData: {[key: string]: any} = {};
    
    data.forEach(invoice => {
      if (!invoice.invoiceDate) return;
      
      const date = new Date(invoice.invoiceDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: this.getMonthName(date.getMonth()),
          year: date.getFullYear(),
          count: 0,
          amount: 0,
          paid: 0,
          pending: 0
        };
      }
      
      monthlyData[monthKey].count++;
      monthlyData[monthKey].amount += invoice.total || 0;
      
      if (invoice.status === 'Paid') {
        monthlyData[monthKey].paid++;
      } else {
        monthlyData[monthKey].pending++;
      }
    });
    
    // Convert to array and sort by date
    this.monthlySummary = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return this.getMonthIndex(b.month) - this.getMonthIndex(a.month);
    });
  }

  applyFilter(): void {
    this.loadSummaryData();
  }

  resetFilter(): void {
    this.filterForm.patchValue({
      year: new Date().getFullYear(),
      month: ''
    });
    this.loadSummaryData();
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  }

  getMonthIndex(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}