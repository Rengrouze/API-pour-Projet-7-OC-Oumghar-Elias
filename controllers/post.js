const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = (req, res, next) => {
   console.log("Api contactée pour récupérer les posts");
   prisma.post
      .findMany({
         include: {
            user: {
               select: {
                  name: true,
                  surname: true,
                  id: true,
                  profilepicurl: true,
                  workplace: true,
               },
            },
         },
         orderBy: {
            id: "desc",
         },
      })
      .then((posts) => {
         res.status(200).json({
            posts: posts,
         });
         console.log("j'ai bien envoyé les posts, j'attends la suite");
      })
      .catch((error) => res.status(500).json({ error }));
};

exports.postOnePost = (req, res, next) => {
   console.log("Api contactée pour ajouter un post");
   //get the actual time
   const fulldate = new Date();
   const year = fulldate.getFullYear();
   const month = fulldate.getMonth() + 1;
   const day = fulldate.getDate();
   const hour = fulldate.getHours();
   const minute = fulldate.getMinutes();

   //format the date
   const date = `${day}/${month}/${year}`;
   const time = `${hour}:${minute}`;

   //get the user info from the user id
   prisma.user
      .findUnique({
         where: {
            id: req.body.op,
         },
      })
      .then((id) => {
         //create the post
         prisma.post
            .create({
               data: {
                  text: req.body.content.text,
                  mediaurl: req.body.content.mediaurl,
                  date: date,
                  time: time,
                  op: req.body.op,
               },
            })
            .then((post) => {
               res.status(201).json({
                  post: post,
               });
            })
            .catch((error) => {
               console.log(error);
               res.status(500).json({ error });
            });
      })
      .catch((error) => res.status(500).json({ error }));
};
