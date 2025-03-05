import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { BillingService } from '../../../../core/services/billing.service';
import { CsvUploadService } from '../../../../core/services/csv-upload.service';


@Component({
  selector: 'app-visa-invoice-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './visa-invoice-upload.component.html',
  styleUrls: ['./visa-invoice-upload.component.scss']
})
export class VisaInvoiceUploadComponent {
  selectedFiles: File[] = [];
  isUploading = false;
  uploadProgress = 0;
  uploadSuccess = false;
  uploadError = false;
  resultMessage = '';
  uploadMode: 'single' | 'multiple' = 'single';

  constructor(
    private billingService: BillingService,
    private csvUploadService: CsvUploadService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    // Only prevent default for drag and drop events
    if (event.type === 'drop' || event.type === 'dragover' || event.type === 'dragenter') {
      event.preventDefault();
      event.stopPropagation();
    }
    
    let files: FileList | File[] = [];
    
    if (event.type === 'drop') {
      files = event.dataTransfer.files;
    } else if (event.target && event.target.files) {
      files = event.target.files;
    } else {
      return;
    }
    
    if (this.uploadMode === 'single' && files.length > 0) {
      this.selectedFiles = [files[0]];
    } else if (this.uploadMode === 'multiple') {
      this.selectedFiles = Array.from(files);
    }
  }

  switchUploadMode(mode: 'single' | 'multiple'): void {
    this.uploadMode = mode;
    this.selectedFiles = [];
    this.resetStatus();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.resetStatus();
  }

  clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.resetStatus();
  }

  resetStatus(): void {
    this.uploadProgress = 0;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.resultMessage = '';
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.uploadError = true;
      this.resultMessage = 'Please select a file to upload.';
      return;
    }

    // Verify files are CSV format
    for (const file of this.selectedFiles) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'csv') {
        this.uploadError = true;
        this.resultMessage = 'Only CSV files are supported. Please select valid CSV files.';
        return;
      }
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.resultMessage = '';

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 300);

    if (this.uploadMode === 'single' && this.selectedFiles.length === 1) {
      // Use csvUploadService as the primary service
      this.csvUploadService.uploadVisaFile(this.selectedFiles[0]).subscribe({
        next: (response) => {
          clearInterval(progressInterval);
          this.handleUploadSuccess('Visa invoice file uploaded successfully.');
        },
        error: (error) => {
          console.error('CSV upload service error:', error);
          // Fallback to billing service if CSV upload service fails
          this.billingService.uploadVisaInvoice(this.selectedFiles[0]).subscribe({
            next: (response) => {
              clearInterval(progressInterval);
              this.handleUploadSuccess('Visa invoice file uploaded successfully.');
            },
            error: (fallbackError) => {
              console.error('Billing service error:', fallbackError);
              clearInterval(progressInterval);
              this.handleUploadError(fallbackError);
            }
          });
        }
      });
    } else if (this.uploadMode === 'multiple' && this.selectedFiles.length > 0) {
      // Use csvUploadService as the primary service
      this.csvUploadService.uploadMultipleVisaFiles(this.selectedFiles).subscribe({
        next: (response) => {
          clearInterval(progressInterval);
          this.handleUploadSuccess(`${this.selectedFiles.length} Visa invoice files uploaded successfully.`);
        },
        error: (error) => {
          console.error('CSV upload service error:', error);
          // Fallback to billing service if CSV upload service fails
          this.billingService.uploadMultipleVisaInvoices(this.selectedFiles).subscribe({
            next: (response) => {
              clearInterval(progressInterval);
              this.handleUploadSuccess(`${this.selectedFiles.length} Visa invoice files uploaded successfully.`);
            },
            error: (fallbackError) => {
              console.error('Billing service error:', fallbackError);
              clearInterval(progressInterval);
              this.handleUploadError(fallbackError);
            }
          });
        }
      });
    }
  }

  private handleUploadSuccess(message: string): void {
    this.uploadProgress = 100;
    this.isUploading = false;
    this.uploadSuccess = true;
    this.resultMessage = message;
    this.selectedFiles = [];
    
    // Stay on the current page instead of navigating elsewhere
    setTimeout(() => {
      this.uploadSuccess = false;
      this.resultMessage = '';
    }, 3000);
  }

  private handleUploadError(error: any): void {
    this.uploadProgress = 0;
    this.isUploading = false;
    this.uploadError = true;
    
    if (error.status === 400) {
      this.resultMessage = 'Invalid file format. Please upload CSV files only.';
    } else if (error.status === 413) {
      this.resultMessage = 'File size is too large. Please upload smaller files.';
    } else if (error.status === 401) {
      this.resultMessage = 'Authentication error. Please log in again.';
    } else if (error.status === 403) {
      this.resultMessage = 'You do not have permission to upload files.';
    } else if (error.status === 404) {
      this.resultMessage = 'Upload service not found. Please contact support.';
    } else if (error.status === 500) {
      this.resultMessage = 'Server error occurred while processing your file. Please try again later.';
    } else if (error.error && error.error.message) {
      this.resultMessage = `Upload failed: ${error.error.message}`;
    } else {
      this.resultMessage = `Failed to upload file: ${error.message || 'Unknown error'}. Please try again later.`;
    }
    
    console.error('Visa file upload error:', error);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
        return 'ti ti-file-spreadsheet';
      case 'xlsx':
      case 'xls':
        return 'ti ti-file-spreadsheet';
      case 'pdf':
        return 'ti ti-file-text';
      case 'txt':
        return 'ti ti-file-text';
      default:
        return 'ti ti-file';
    }
  }

  formatFileSize(size: number): string {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }
  navigateToList(): void {
    this.router.navigate(['/invoices/visa']);
  }
}