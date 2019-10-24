import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent  {
  pageTitle = 'Products';
  errorMessage = '';
  
  products$ = this.productService.$products.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  );

  selectedProduct$ = this.productService.selectProduct$;
  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
   this.productService.selectedProductChanged(productId);
  }
}
