// @vsc repo:vsc-project-169-backend file:src/services/postService.ts task:b15-src-services-postservice-ts module:backend session:169
import { prisma } from '../utils/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { Post } from '@prisma/client';

class ApplicationError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

/**
 * Retrieve a paginated list of posts.
 * @param options - Pagination and filter options.
 * @returns Array of posts.
 */
export async function getAllPosts(options: {
  skip?: number;
  take?: number;
  published?: boolean;
}): Promise<Post[]> {
  const {
    skip = 0,
    take = 10,
    published = true,
  } = options;

  try {
    return await prisma.post.findMany({
      skip,
      take,
      where: { published },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ApplicationError('خطا در دریافت پست‌ها', 500);
    }
    throw err;
  }
}

/**
 * Retrieve a single post by its ID.
 * @param id - Post ID.
 * @returns Post object or null if not found.
 */
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    return post ?? null;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ApplicationError('خطا در دریافت پست', 500);
    }
    throw err;
  }
}

/**
 * Create a new post.
 * @param data - Post creation data.
 * @returns Created post.
 */
export async function createPost(data: {
  title: string;
  content: string;
  authorId: number;
  published?: boolean;
}): Promise<Post> {
 const { title, content, authorId, published = false } = data;

 // Validate author exists
 try {
   const authorExists = await prisma.user.findUnique({
     where: { id: authorId },
   });
   if (!authorExists) {
     throw new ApplicationError('نویسنده یافت نشد', 404);
   }
 } catch (err) {
   if (err instanceof ApplicationError) throw err;
   throw new ApplicationError('خطا در بررسی نویسنده', 500);
 }

 try {
   return await prisma.post.create({
     data: {
       title,
       content,
       published,
       authorId,
     },
   });
 } catch (err) {
   if (err instanceof PrismaClientKnownRequestError) {
     if (err.code === 'P2002') {
       throw new ApplicationError('پست با این ویژگی‌ها تکراری است', 400);
     }
     throw new ApplicationError('خطا در ایجاد پست', 500);
   }
   throw err;
 }
}

/**
 * Update an existing post.
 * @param id - Post ID.
 * @param data - Fields to update.
 * @returns Updated post.
 */
export async function updatePost(
 id: number,
 data: Partial<Pick<Post, 'title' | 'content' | 'published'>>
): Promise<Post> {
 // Ensure post exists
 try {
   const existing = await prisma.post.findUnique({ where: { id } });
   if (!existing) {
     throw new ApplicationError('پست یافت نشد', 404);
   }
 } catch (err) {
   if (err instanceof ApplicationError) throw err;
   throw new ApplicationError('خطا در یافتن پست برای به‌روزرسانی', 500);
 }

 try {
   return await prisma.post.update({
     where: { id },
     data,
   });
 } catch (err) {
   if (err instanceof PrismaClientKnownRequestError) {
     throw new ApplicationError('خطا در به‌روزرسانی پست', 500);
   }
   throw err;
 }
}

/**
 * Delete a post by its ID.
 * @param id - Post ID.
 * @returns Deleted post.
 */
export async function deletePost(id: number): Promise<Post> {
// Ensure post exists
 try{
 const existing = await prisma.post.findUnique({ where:{id}});
 if(!existing){
throw new ApplicationError('پست یافت نشد',404);
}
}catch(err){
if(err instanceof ApplicationError)throw err;
throw new ApplicationError('خطا در یافتن پست برای حذف',500);
}

try{
return await prisma.post.delete({
where:{id},
});
}catch(err){
if(err instanceof PrismaClientKnownRequestError){
throw new ApplicationError('خطا در حذف پست',500);
}
throw err;
}
}

/**
 * Retrieve posts by a specific author with pagination.
 * @param authorId - Author's user ID.
 * @param options - Pagination options.
 * @returns Array of posts belonging to the author.
 */
export async function getPostsByAuthor(
 authorId:number,
 options:{skip?:number;take?:number}={}
):Promise<Post[]>{
const{skip=0,take=10}=options;

// Validate author exists
try{
const authorExists=await prisma.user.findUnique({where:{id:authorId}});
if(!authorExists){
throw new ApplicationError('نویسنده یافت نشد',404);
}
}catch(err){
if(err instanceof ApplicationError)throw err;
throw new ApplicationError('خطا در بررسی نویسنده',500);
}

try{
return await prisma.post.findMany({
skip,
take,
where:{authorId},
orderBy:{createdAt:'desc'},
});
}catch(err){
if(err instanceof PrismaClientKnownRequestError){
throw new ApplicationError('خطا در دریافت پست‌های نویسنده',500);
}
throw err;
}
}
