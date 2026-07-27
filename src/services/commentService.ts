// @vsc repo:vsc-project-169-backend file:src/services/commentService.ts task:b15-src-services-commentservice-ts module:backend session:169
import { PrismaClient } from '../utils/prisma';
import { Comment } from '@prisma/client';

const prisma = new PrismaClient();

class ApplicationError extends Error {
  constructor(public statusCode:number, message:string) {
    super(message);
    this.name='ApplicationError';
  }
}

/**
 * دریافت نظرات یک پست به صورت جدیدترین اول
 */
export async function getCommentsByPostId(
  postId:number,
  options:{skip?:number; take?:number}={}
):Promise<Comment[]>{
 const{skip=0,take}=options;
 try{
   return await prisma.comment.findMany({
     where:{postId},
     orderBy:{createdAt:'desc'},
     skip,
     take,
     include:{
       author:{
         select:{id:true,email:true,name:true}
       }
     }
   });
 }catch(err){
   throw new ApplicationError(500,'خطا در دریافت نظرات');
 }
}

/**
 * ایجاد نظر جدید
 */
export async function createComment(data:{
 content:string;
 postId:number;
 authorId:number;
}):Promise<Comment>{
 const{content,postId,authorId}=data;
 const postExists=await prisma.post.findUnique({where:{id:postId},select:{id:true}});
 if(!postExists){
   throw new ApplicationError(404,'پست مورد نظر یافت نشد');
 }
 const userExists=await prisma.user.findUnique({where:{id:id},select:{id:true}});
 if(!userExists){
   throw new ApplicationError(404,'کاربر مورد نظر یافت نشد');
 }
 try{
   return await prisma.comment.create({
     data:{content,postId,authorId},
     include:{
       author:{select:{id:true}}
     }
   });
 }catch(err){
   throw new ApplicationError(500,'خطا در ایجاد نظر');
 }
}

/**
 * به‌روزرسانی محتوی یک看法
 */
export async function updateComment(id:number,data:{content:string}):Promise<Comment>{
 const{content}=data;
 try{
   const comment=await prisma.comment.update({
     where:{id},
     data:{content},
     include:{
       author:{select:{id:true}}
     }
   });
   return comment;
 }catch(err){
   if(err.code==='P2025'){
     throw new ApplicationError(404,'نظر مورد نظر یافت نشد');
   }
   throw new ApplicationError(500,'خطا در به‌روزرسانی看法');
 }
}

/**
 * حذف یک看法 و بازگرداندن آن
 */
export async function deleteComment(id:number):Promise<Comment>{
 try{
   const comment=await prisma.comment.delete({
     where:{id},
     include:{
       author:{select:{id:true}}
     }
   });
   return comment;
 }catch(err){
   if(err.code==='P2025'){
     throw new ApplicationError(404,'نظر مورد نظر یافت نشد');
   }
   throw new ApplicationError(500,'خطا در حذف看法');
 }
}
