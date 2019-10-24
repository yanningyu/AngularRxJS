import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, EMPTY, empty, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
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

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  categories$ = this.productCategoryService.productcategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  )

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selectedCategoryId]) => 
      products.filter( product => {
        return selectedCategoryId ? product.categoryId === selectedCategoryId : true
      }
        
        )),
        catchError(err => {
          this.errorMessage = err;
          return EMPTY
        })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
    ) { }


  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
