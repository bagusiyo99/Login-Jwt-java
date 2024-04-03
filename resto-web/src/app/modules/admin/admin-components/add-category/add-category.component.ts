import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

  constructor(
    private service: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      img: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
  }

  postCategory() {
    const formData: FormData = new FormData();
    formData.append("img", this.selectedFile);
    formData.append("name", this.categoryForm.get("name").value);
    formData.append("description", this.categoryForm.get("description").value);
    this.service.postCategory(formData).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
