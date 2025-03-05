import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';
import { BankService } from '../../../core/services/bank.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule ,Validators} from '@angular/forms';
import { BankInfoDetailDto,BankInfoRequestDto } from '../../../core/models/invoice.models';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bank-info-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './bank-info-update.component.html',
  styleUrl: './bank-info-update.component.scss'
})
export class BankInfoUpdateComponent  implements OnInit, OnDestroy {
    bankInfoForm: FormGroup;
    bankId: string | null = null;
    bank: BankInfoDetailDto | null = null;
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    private subscriptions: Subscription[] = [];
   
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private bankService: BankService
    ) {  this.bankInfoForm = this.fb.group({
            bankName: ['', [Validators.required]],
            billableIca: ['', [Validators.required]],
            currency: ['', [Validators.required]],
            country: ['', [Validators.required]],
          });}
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.bankId = params.get('id');
        if (this.bankId) {
          this.loadBankDetails(this.bankId);
        } else {
          this.errorMessage = 'Invoice ID is missing.';
        }
      });
    }

    ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  
    loadBankDetails(id: string): void {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.bankService.getBankById(id).subscribe({
        next: (data) => {
          this.bank = data;
          this.bankInfoForm.patchValue({
            bankName: this.bank.bankName,
            billableIca: this.bank.billableIca,
            currency: this.bank.currency,
            country: this.bank.country
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bank details:', error);
          this.errorMessage = 'Failed to load bank details. Please try again later.';
          this.isLoading = false;
        }
      });
    }
    onSubmit(): void {
      if (this.bankInfoForm.invalid) {
        return;
      }
      this.bankInfoForm.get('billableIca')?.enable();
      if (this.bankInfoForm.valid) {
        const updatedBankInfo: BankInfoRequestDto = {
          ...this.bankInfoForm.value
        };
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.subscriptions.push(
        this.bankService.updateBank(updatedBankInfo).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = 'Bank information updated successfully.';
            this.bankInfoForm.get('billableIca')?.disable();
            setTimeout(() => {
              this.navigateToBanks();
            }, 3000);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating bank information:', error);
            this.errorMessage = 'Failed to update bank information. Please try again later.';
          }
        })
      );
    }
  }
  
    navigateToBanks(): void {
      this.router.navigate(['/bank-list']);
    }
    
    resetFilter(): void {
      this.bankInfoForm.reset();
      this.loadBankDetails(this.bankId);
    }
}
