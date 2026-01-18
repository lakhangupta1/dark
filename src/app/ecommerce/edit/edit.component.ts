import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/service/product.service';

@Component({
  templateUrl: './edit.component.html',
  standalone: true,
  styleUrls: ['./edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditComponent implements OnInit {
  productForm: FormGroup;
  uploadedImage: any;
  productId = '';
  categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toaster: ToastrService
  ) {
    // Initialize form immediately to prevent NG01052 error
    this.productForm = this.createForm();
  }

  ngOnInit() {
    // Get ID from route
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id')!;
      if (this.productId) {
        this.loadProduct(this.productId);
      }else{
        this.createForm();
      }
    });
  }

  createForm(product: any = null): FormGroup {
    return this.fb.group({
      productName: [product?.product_name || '', Validators.required],
      subText: [product?.sub_text || ''],
      category: [product?.category || '', Validators.required],
      status: [product?.status || 'publish', Validators.required],
      price: [product?.price || '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      discount: [product?.discount || ''],
      description: [product?.description || ''],
      metaTitle: [product?.meta_title || ''],
      metaKeyword: [product?.meta_key || ''],
      image: [product?.image || ''],
      generalInfo: this.fb.array([
        this.fb.group({ key: ['Brand'], value: [product?.general_info?.brand || ''] }),
        this.fb.group({ key: ['Delivery Condition'], value: [product?.general_info?.delivery_conditions || ''] }),
        this.fb.group({ key: ['Seat Lock Included'], value: [product?.general_info?.seat_lock_included || ''] }),
        this.fb.group({ key: ['Type'], value: [product?.general_info?.type || ''] }),
        this.fb.group({ key: ['Style'], value: [product?.general_info?.style || ''] }),
        this.fb.group({ key: ['Wheels Included'], value: [product?.general_info?.wheels_included || ''] }),
        this.fb.group({ key: ['Upholstery Included'], value: [product?.general_info?.upholstery_included || ''] }),
      ])
    });
  }

  get generalInfo(): FormArray {
    return this.productForm.get('generalInfo') as FormArray;
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next : result => {
        console.log(" result -> ", result );
        if (result.error) {
          this.toaster.error(result.message);
        } else {
          this.toaster.success(result.message);
          const product = result.payload[0]; // assuming payload is an array
          if (product) {
            this.productForm.patchValue({
              productName: product.product_name,
              subText: product.sub_text,
              category: product.category,
              status: product.status,
              price: product.price,
              discount: product.discount,
              description: product.description,
              metaTitle: product.meta_title,
              metaKeyword: product.meta_key,
              image: product.image
            });

            // Update generalInfo FormArray
            const general = product.general_info || {};
            const generalInfoArray = this.productForm.get('generalInfo') as FormArray;
            generalInfoArray.clear();
            generalInfoArray.push(this.fb.group({ key: 'Brand', value: general.brand || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Delivery Condition', value: general.delivery_conditions || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Seat Lock Included', value: general.seat_lock_included || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Type', value: general.type || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Style', value: general.style || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Wheels Included', value: general.wheels_included || '' }));
            generalInfoArray.push(this.fb.group({ key: 'Upholstery Included', value: general.upholstery_included || '' }));

          }
        }
      },
      error : error => {
        console.log(" error -> ", error );
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.uploadedImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach(key => {
        if (key === 'generalInfo') {
          formData.append(key, JSON.stringify(this.productForm.get(key)?.value));
        } else {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });

      if (this.uploadedImage instanceof File) {
        formData.append('image', this.uploadedImage);
      }

      console.log('Form Data:', this.productForm.value);
      if(this.productId){
        this.productService.editProducts(this.productForm.value,this.productId).subscribe({
          next: (result) => {
            console.log(" edit result ", result );
          },
          error : (error) =>{
            console.log(" erro in edit prod -> ", error );
          }
        })
      }else{
        this.productService.createProduct(formData).subscribe({
          next : ( result )=>{
            console.log(" result in create prod -> ", result );
          },
          error : ( error ) => {
            console.log(" error in create prod -> ", error );
          }
        })
      }
      // Call your service to save product here
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
