import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Post } from './post.model';

const BACKEND_URL = "http://localhost:3000/api/v1/posts";

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[] = [];

  constructor(private http: HttpClient) { }


  getPosts() {
    return this.http.get<Post[]>(BACKEND_URL);
  }

  getPost(id: number) {
    return this.http.get(BACKEND_URL+'/'+id)
  }

  addPost(post: Post) {
   return this.http.post<Post>(BACKEND_URL, post)
  }

  //we could extract the id from the post argument, but since the id property is optional, this way we make sure nobody tries to call the function with a post without id
  updatePost(post: Post, postId: number) { 
    return this.http.put<Post>(BACKEND_URL +'/'+postId, post)
  }

  deletePost(postId: number) {
    return this.http.delete<Post>(BACKEND_URL + '/' + postId)
  }
}
