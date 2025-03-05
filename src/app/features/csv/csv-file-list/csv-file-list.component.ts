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
  Math = Math;
  csvFiles: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtering form
  filterForm: FormGroup;

  // Sorting properties
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
      startDate: this.filterForm.value.uploadDate,
      ...this.filterForm.value
    };

    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });

    this.csvUploadService.getCsvFiles(params).subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
            'content' in data && 'totalElements' in data) {
          const paginatedData = data as { content: any[], totalElements: number, totalPages: number };
          this.totalElements = paginatedData.totalElements;
          this.csvFiles = paginatedData.content;
          this.totalPages = paginatedData.totalPages;
        } else {
          this.csvFiles = Array.isArray(data) ? data : [];
          this.totalElements = this.csvFiles.length;
        }

        if (this.csvFiles.length === 0 && this.currentPage > 0) {
          this.currentPage--;
          this.loadCsvFiles();
          return;
        }
        
        // Appliquer le tri après le chargement
        this.sortData(this.sortColumn);

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
    this.currentPage = 0;
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
    if ((this.currentPage + 1)  < this.totalPages) {
      this.currentPage--;
      this.loadCsvFiles();
    }
  }

  nextPage(): void {
    if (this.csvFiles.length > 0) {
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

  // Fonction pour trier les données
  sortData(column: string): void {
    if (!column) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.csvFiles.sort((a, b) => {
      let valueA = a[column] || '';
      let valueB = b[column] || '';

      if (column === 'uploadDate') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      } else {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
