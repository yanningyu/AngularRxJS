import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Supplier } from 'src/app/suppliers/supplier';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  product;

  product$ = this.productService.selectedProduct$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productSuppliers$ = this.productService.selectedProductSuppliers$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  constructor(private productService: ProductService) { }

}
