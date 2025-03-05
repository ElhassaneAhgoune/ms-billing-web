import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CsvUploadService } from '../../../core/services/csv-upload.service';
import { CsvFileParams } from '../../../core/models/invoice.models';

@Component({
  selector: 'app-csv-file-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './csv-file-list.component.html',
  styleUrls: ['./csv-file-list.component.scss']
})
export class CsvFileListComponent implements OnInit {
  // Make Math available to the template
  Math = Math;
  csvFiles: any[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  
  // Filtering form
  filterForm: FormGroup;
  
  constructor(
    private csvUploadService: CsvUploadService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      csvName: [''],
      network: [''],
      uploadDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCsvFiles();
  }

  loadCsvFiles(): void {
    this.isLoading = true;
    
    const params: CsvFileParams = {
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
    
    this.csvUploadService.getCsvFiles(params).subscribe({
      next: (data) => {
        this.csvFiles = data;
        // If the API returns paginated data in a different format, adjust accordingly
        // this.totalElements = data.totalElements;
        // this.csvFiles = data.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading CSV files:', error);
        this.errorMessage = 'Failed to load CSV files. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 0; // Reset to first page when applying filters
    this.loadCsvFiles();
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadCsvFiles();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCsvFiles();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCsvFiles();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
      this.currentPage++;
      this.loadCsvFiles();
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return '–';
    }
    return new Date(date).toLocaleDateString();
  }

  getNetworkClass(network: string): string {
    if (!network) return '';
    
    switch (network.toLowerCase()) {
      case 'visa':
        return 'badge-visa';
      case 'mastercard':
      case 'master-card':
        return 'badge-mastercard';
      default:
        return '';
    }
  }
  
  viewCsvDetails(csvFile: any): void {
    const network = csvFile.network?.toLowerCase();
    const csvName = csvFile.csvName;
    
    if (network === 'visa') {
      window.location.href = `/csv/visa-details/${csvName}`;
    } else if (network === 'mastercard' || network === 'master-card') {
      window.location.href = `/csv/mastercard-details/${csvName}`;
    }
  }
}