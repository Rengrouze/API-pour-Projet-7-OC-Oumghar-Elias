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
            comment: {
               select: {
                  enable: true,
                  id: true,
                  text: true,
                  date: true,
                  time: true,
                  mediaurl: true,

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
      .catch((error) => res.status(500).json(error.message));
};

exports.postOnePost = (req, res, next) => {
   console.log("Api contactée pour ajouter un post");
   //get the actual time
   const fulldate = new Date();
   const year = fulldate.getFullYear();
   var month = fulldate.getMonth() + 1;
   if (month < 10) {
      month = "0" + month;
   }
   var day = fulldate.getDate();
   if (day < 10) {
      day = "0" + day;
   }
   var hour = fulldate.getHours();
   if (hour < 10) {
      hour = "0" + hour;
   }
   var minute = fulldate.getMinutes();
   if (minute < 10) {
      minute = "0" + minute;
   }

   //format the date
   const date = `${day}/${month}/${year}`;
   const time = `${hour}:${minute}`;

   const mediaurl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : req.body.mediaurl;

   //get the user info from the user id
   prisma.user
      .findUnique({
         where: {
            id: parseInt(req.body.op),
         },
      })
      .then((id) => {
         //create the post
         prisma.post
            .create({
               data: {
                  text: req.body.text,
                  mediaurl,
                  date,
                  time,
                  op: parseInt(req.body.op),
                  commentsnumber: 0,
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
exports.postOneComment = (req, res, next) => {
   console.log("Api contactée pour ajouter un commentaire");
   //get the actual time
   const fulldate = new Date();
   const year = fulldate.getFullYear();
   var month = fulldate.getMonth() + 1;
   if (month < 10) {
      month = "0" + month;
   }
   var day = fulldate.getDate();
   if (day < 10) {
      day = "0" + day;
   }
   var hour = fulldate.getHours();
   if (hour < 10) {
      hour = "0" + hour;
   }
   var minute = fulldate.getMinutes();
   if (minute < 10) {
      minute = "0" + minute;
   }

   //format the date
   const date = `${day}/${month}/${year}`;
   const time = `${hour}:${minute}`;
   const mediaurl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : req.body.mediaurl;

   //get the user info from the user id
   prisma.user
      .findUnique({
         where: {
            id: parseInt(req.body.op),
         },
      })
      .then((id) => {
         //create the comment
         prisma.comment
            .create({
               data: {
                  text: req.body.text,
                  date,
                  mediaurl,
                  time,
                  user__id: parseInt(req.body.op),
                  post__id: parseInt(req.body.post),
               },
            })
            .then((comment) => {
               res.status(201).json({
                  comment: comment,
               });
            })
            .catch((error) => {
               console.log(error);
               res.status(500).json({ error });
            });
      })
      .catch((error) => res.status(500).json(error.message));
};
