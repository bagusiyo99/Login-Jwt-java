import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-services/auth-service/auth.service';
import { StorageService } from 'src/app/auth-services/storage-service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSpinning: boolean;

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private router:Router,
  ) {}

ngOnInit(): void {
  // Membuat FormGroup menggunakan FormBuilder untuk mengelola validasi formulir
  this.loginForm = this.fb.group({
    // Menetapkan validator untuk memastikan bahwa email wajib diisi dan berformat valid
    email: [null, Validators.required],
    // Menetapkan validator untuk memastikan bahwa password wajib diisi
    password: [null, Validators.required]
  });
}


submitForm() {
  // Memeriksa apakah formulir sudah valid sebelum memproses login
  this.service.login(this.loginForm.value).subscribe((res) => {
    console.log(res);
    if (res.userId != null) {
      const user = {
        id: res.userid,
        role: res.userRole
      }
      console.log(user);
      StorageService.saveToken(res.jwt);
      StorageService.saveUser(user);
      if (StorageService.isAdminLoggedIn()) {
        this.router.navigateByUrl("admin/dashboard"); 
      } else if (StorageService.isCustomerLoggedIn()) {
        this.router.navigateByUrl("customer/dashboard"); 
      }
    } else {
      console.log("salah email atau passwort");
    }
  });
}


}
