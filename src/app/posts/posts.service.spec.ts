import { of, throwError } from 'rxjs';
import { PostsService } from './posts.service';
import { posts as samplePosts } from './samplePosts';
import { Post } from './post.model'
import { HttpErrorResponse } from '@angular/common/http';
let httpClientSpy;

const BACKEND_URL = "http://localhost:3000/api/v1/posts";


describe('PostsService', () => {
  let service: PostsService;

  let posts: Post[]

  beforeEach(() => {
    posts = [...samplePosts]
    httpClientSpy = jasmine.createSpyObj(['get', 'post', 'put', 'delete'])
    service = new PostsService(httpClientSpy as any); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return the expected posts when getPosts is called", () => {
    httpClientSpy.get.and.returnValue(of(posts));
    
    service.getPosts().subscribe(fetchedPosts => {
      expect(fetchedPosts).toEqual(posts)
    });
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  })

  it("should return the expected post when get post is called", () => {
    const id = 1; 

    httpClientSpy.get.and.returnValue(of(posts[id]));
    
    service.getPost(id).subscribe(fetchedPost => {
      expect(fetchedPost["title"]).toContain('Barcelona')
    });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(BACKEND_URL+'/'+id);
  })


  it("should return the created post when addPost is called", () => {
    const newPost = {
      title: "Santiago",
      content: "Lorem Ipsum"
    }

    const postToReturn = {
      id: 4,
      title: "Santiago",
      content: "Lorem Ipsum"
    }

    httpClientSpy.post.and.returnValue(of(postToReturn));

    service.addPost(newPost).subscribe();

     service.addPost(newPost).subscribe(createdPost => {
      expect(createdPost).toEqual(postToReturn)
    }); 
  })
  
  it('should return an error when get post is called and the server returns an error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
    });

    httpClientSpy.get.and.returnValue(throwError(errorResponse));

    service.getPost(5).subscribe(
      response => fail('expected an error, not a response'),
      error  => expect(error.status).toBe(404)
    );
  });

  it("should return the updated post when update post is called", () => {
    const changedPost = {
      id: 2,
      title: "London",
      content: "Lorem Ipsum"
    }

    httpClientSpy.put.and.returnValue(of(changedPost));

    service.updatePost(changedPost, changedPost.id).subscribe(updatedPost => {
      expect(updatedPost).toEqual(changedPost)
    }); 
  })

  it('should return an error when update post is called and the server returns an error', () => {
    const changedPost = {
      id: 2,
      title: "London",
      content: "Lorem Ipsum"
    }
    
    const errorResponse = new HttpErrorResponse({
      status: 404,
    });

    httpClientSpy.put.and.returnValue(throwError(errorResponse));

    service.updatePost(changedPost, 5).subscribe(
      response => fail('expected an error, not a response'),
      error  => expect(error.status).toBe(404)
    );
  });

  
  it("should return empty when delete post is called", () => {
    const id = 0; 
    
    httpClientSpy.delete.and.returnValue(of(''));
    
    service.deletePost(id).subscribe(response => {
      expect(response).toBeFalsy();
    }); 
  })
  
    
  it('should return an error when delete post is called and the server returns an error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
    });

    httpClientSpy.delete.and.returnValue(throwError(errorResponse));

    service.deletePost(5).subscribe(
      response => fail('expected an error, not a response'),
      error  => expect(error.status).toBe(404)
    );
  });

})
