import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './admin-components/dashboard/dashboard.component';
import { AddCategoryComponent } from './admin-components/add-category/add-category.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { NzFormModule } from 'ng-zorro-antd/form'; // Pastikan ini diimpor
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostProductComponent } from './admin-components/post-product/post-product.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AddCategoryComponent,
    PostProductComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
        NzFormModule // Pastikan diimpor di sini

    
  ]
})
export class AdminModule { }
