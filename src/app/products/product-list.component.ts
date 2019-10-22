import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, EMPTY, empty } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent  {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCategoryId = 1;

  products$ = this.productService.productsWithCategory$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  );

  productsSimpleFilter$ = this.productService.productsWithCategory$
  .pipe(
    map(products => products.filter(product =>
      this.selectedCategoryId ? product.categoryId ===this.selectedCategoryId : true
      ))
  );

  categories$ = this.productCategoryService.productcategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  )
  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
    ) { }

 

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryId = +categoryId;
  }
}
