import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Post } from './post.model';
import { Observable, Subject, throwError } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators"

const BACKEND_URL = "http://localhost:3000/api/v1/posts";

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    if (this.posts)
      return this.postsUpdated.next(this.posts);

    //we only need to fetch the posts if we haven't got them in memory already

    this.http.get<Post[]>(BACKEND_URL)
      .pipe(
        catchError(this.handleError)
      ) 
      .subscribe(
      {
        next: (fetchedPosts) => {
          this.posts = fetchedPosts;
          this.postsUpdated.next(this.posts);
        }
      }
    );
  }

  getUpdatedPosts() {
    return this.postsUpdated as Observable<Post[]>;
  }

  // the data in the array is the same than the data in the detail. We only need to get the detail if we haven't got the post in the array already (we access the detail page directly)
  getPost(id: number) {
    const returnPost = this.posts?.find(post => post.id === id)
    if (returnPost) {
      return of(returnPost)
    }
    return this.http.get(BACKEND_URL + '/' + id).pipe(
      catchError(this.handleError)
    )
  }

  addPost(post: Post) {
    return this.http.post<Post>(BACKEND_URL, post).pipe(
      catchError(this.handleError),
      map(post => {
        this.posts.push(post)
        return post;
      }));
  }

  //we could extract the id from the post argument, but since the id property is optional, this way we make sure nobody tries to call the function with a post without id
  updatePost(post: Post, postId: number) { 
    return this.http.put<Post>(BACKEND_URL + '/' + postId, post).pipe(
      catchError(this.handleError),
      map(updatedPost => {
        let postToUpdateIndex = this.posts.findIndex(post => post.id === updatedPost.id)
        this.posts[postToUpdateIndex] = { ...updatedPost };
        return updatedPost; 
      })
    )
  }

  deletePost(postId: number) {
    return this.http.delete<Post>(BACKEND_URL + '/' + postId).pipe(
      catchError(this.handleError),
      map(() => {
        this.posts = this.posts.filter(post => post.id !== postId)
        return true
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.

    return throwError(
      'Something bad happened; please try again later.');
    
  }
}
