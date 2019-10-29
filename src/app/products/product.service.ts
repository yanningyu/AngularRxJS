import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, combineLatest, BehaviorSubject, Subject, merge, ReplaySubject } from 'rxjs';
import { catchError, tap, map, scan, shareReplay } from 'rxjs/operators';


import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
              private productCategoryService: ProductCategoryService,
              private supplierService: SupplierService) { }
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  products$ = this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(data => console.log('Products: ', JSON.stringify(data))),
        catchError(this.handleError)
      );


  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productcategories$
  ]).pipe(
    map(([products, categories]) => products.map(product => ({
      ...product,
      price: product.price * 1.5,
      category: categories.find(c => product.categoryId === c.id).name,
      searchKey: [product.productName]
    }) as Product)),
    shareReplay()
  );

  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAtion$ = this.productSelectedSubject.asObservable();

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAtion$,
  ]).pipe(
    map(([products, selectedProductId]) =>
    products.find(product => product.id === selectedProductId)),
    tap(product => console.log('selectedProduct', product)),
    shareReplay()
  );
  // .pipe(
  //   map(products => products.find(product => product.id === 5)
  //   ),
  //   tap(product => console.log('selectedProduct', product))
  // );

  selectedProductSuppliers$ = combineLatest([
    this.selectedProduct$,
    this.supplierService.suppliers$
  ]).pipe(
    tap(([selectedProduct, suppliers]) => console.log('trigger selectedProduct suppliers', JSON.stringify(selectedProduct))),
    map(([selectedProduct, suppliers]) =>
    suppliers.filter(supplier => selectedProduct.supplierIds.includes(supplier.id)))
  );
  private productInsertedSubject = new ReplaySubject<Product>();
  productInsertedAction$ = this.productInsertedSubject.asObservable();

  // tslint:disable-next-line: deprecation
  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedAction$)
    .pipe(scan((acc: Product[], value: Product) => [...acc, value]
    ),
    shareReplay()
    );

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }
  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
