import { Component } from '@angular/core';
import { logAndRetry, logAndRetryWithParams, logging, retry, retryWithParams, typedLogging } from './methodDecorator';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'applicationsOfDecorator';

  constructor(private service:DataService){}

  @logging
  getData(){
    console.log("getting data")
  }

  @retry
  @logging
  fetchUsers(){
   /**
    * TS takes the reference of the fetchUsers() and passes it to the @log decorator.
    * This means the @log decorator receives the method definition of fetchUsers() as target function.
    * The function returned by the @log decorator is passed to the @retry decorator as target function.
    * As you notice, this happens from bottom to top.
    * When the fetchUsers() is called, the @retry decorator executes, within which the target function
    * executes. As we know that the target is nothing but the function returned by the @log decorator.
    * This means that the @log decorator executes. Inside the @log decorator, the target is the fetchUsers()
    * which is then executed.
    * This means everytime, the return function of @retry is executed, the return function of @log will
    * also be executed.
    */
    console.log("executing the component method")
    throw new Error("some error occured fetching users")
  }

  @logging
  @retryWithParams(5)
  fetchComments(){
    /**
     * TS takes the reference of the fetchComments() and passes it to the @retryWithParams decorator.
     * This means the @retryWithParams decorator receives the method definition of fetchComments() as
     * target function. The function returned by @retryWithParams decorator is passed to the @log decorator as
     * target function.
     * As you notice, this happens from bottom to top.
     * When fetchComments() is called, @log decorator executes, within which the target function executes.
     * As we know that the target is nothing but the function returned by the @retryWithParams decorator.
     * This means the @retryWithParams executes. Inside this the target is fetchComments(), which in turn
     * executes.
     * This means everytime, the return function of @retryWithParams executes, the @log will not execute.
     * The @log will execute only once in the beginning, after which only the @retryWithParams and fetchComments()
     * executes.
     */
    console.log("executing fetchComments method")
    throw new Error("some error occured fetching comments")
  }

  @logAndRetry
  fetchToDos(){
    console.log("executing fetchToDos method")
    throw new Error("some error occured fetching todos")
  }

  @logAndRetryWithParams
  fetchPhotos(){
    console.log("executing fetchPhotos method")
    throw new Error("some error occured fetching photos")
  }

  @typedLogging
  fetchAlbums(){
    console.log("executing fetchAlbums method")
    throw new Error("some error occured fetching albums")
  }


  ngOnInit(){
   //this.getData();
  }
}
