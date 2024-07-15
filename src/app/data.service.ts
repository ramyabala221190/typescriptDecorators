import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from './methodDecorator';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  getUsers(){
    return this.http.get('https://jsonplaceholde.typicode.com/users')
  }
}
