import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/auth-services/auth-service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  isSpinning:boolean;
  validateForm:FormGroup;

  constructor (private service: AuthService,
     private fb :FormBuilder,
     private notification :NzNotificationService
     ){}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      checkPassword: ["", Validators.required],
      name: ["", Validators.required],
    });

    // Menambahkan validasi kustom untuk konfirmasi password
    this.validateForm.get('checkPassword').setValidators(this.confirmationValidator);

    // Memanggil updateValueAndValidity() setiap kali nilai password berubah
    this.validateForm.get('password').valueChanges.subscribe(() => {
      this.validateForm.get('checkPassword').updateValueAndValidity();
    });
  }

  // Validasi kustom untuk konfirmasi password
  confirmationValidator = (control: FormControl): {[s: string]: boolean} | null => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.get('password').value) {
      return { confirm: true, error: true };
    }
    return null;
  }

  // Mendapatkan pesan validasi untuk password
  getPasswordValidationMessage(): string {
    const control = this.validateForm.get('password');
    if (control.hasError('required')) {
      return 'Password wajib diisi';
    }
    if (control.hasError('pattern')) {
      return 'Password harus memiliki setidaknya 8 karakter, 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter khusus';
    }
    return '';
  }

  // Mendapatkan pesan validasi untuk konfirmasi password
  getConfirmPasswordValidationMessage(): string {
    const control = this.validateForm.get('checkPassword');
    if (control.hasError('required')) {
      return 'Konfirmasi password wajib diisi';
    }
    if (control.hasError('confirm')) {
      return 'Konfirmasi password tidak cocok dengan password';
    }
    return '';
  }

  register(): void {
    if (this.validateForm.valid) {
      this.service.signup(this.validateForm.value).subscribe((res) => {
        console.log(res);
        if (res.id != null) {
          this.notification.success("Selamat", "Kamu telah terdaftar", { nzDuration: 5000 });
          this.validateForm.reset(); // Membersihkan formulir setelah berhasil mendaftar
        } else {
          this.notification.error("Error", "Kamu tidak terdaftar", { nzDuration: 5000 });
        }
      });
    } else {
      this.notification.error("Error", "Silakan lengkapi formulir dengan benar", { nzDuration: 5000 });
    }
  }
}
