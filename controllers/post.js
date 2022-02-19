const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = (req, res, next) => {
   console.log("Api contactée pour récupérer les posts");
   prisma.post
      .findMany({
         where: {
            enable: 1,
         },
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
                  post__id: true,

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
                  id: "asc",
               },
            },
            liked_post: {
               select: {
                  user__id: true,
                  liked: true,
               },
            },
            reported_post: {
               select: {
                  user__id: true,
                  reported: true,
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
               },
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
                  liked_post: {},
                  reported_post: {},
                  comment: {
                     include: {
                        user: {},
                     },
                  },
               },
            })
            .then((post) => {
               res.status(201).json({
                  //response the post and attach the user info
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
            })
            .then((comment) => {
               console.log("Commentaire créé");
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

exports.like = (req, res, next) => {
   console.log(req.body);
   console.log("Api contactée pour liker un post ou supprimer un like");
   prisma.liked_post
      .upsert({
         where: {
            user__id_post__id: {
               post__id: req.body.postId,
               user__id: req.body.userId,
            },
         },
         create: {
            post__id: req.body.postId,
            user__id: req.body.userId,
            liked: req.body.signal,
         },
         update: {
            liked: req.body.signal,
         },
      })
      .then((liked_post) => {
         //check if the post has been liked_post
         console.log(liked_post.liked);
         res.status(200).json({
            like: !!liked_post.liked,
         });
      })
      .catch((error) => res.status(500).json(error.message));
};
exports.reportPost = (req, res, next) => {
   console.log("Api contactée pour signaler un post ou supprimer un signalement");
   prisma.reported_post
      .upsert({
         where: {
            user__id_post__id: {
               post__id: req.body.postId,
               user__id: req.body.userId,
            },
         },
         create: {
            post__id: req.body.postId,
            user__id: req.body.userId,
            reported: req.body.signal,
         },
         update: {
            reported: req.body.signal,
         },
      })
      .then((reported_post) => {
         console.log(reported_post.reported);

         res.status(200).json({
            report: !!reported_post.reported,
         });
      })
      .catch((error) => res.status(500).json(error.message));
};
exports.supressPost = (req, res, next) => {
   console.log(req.body);
   console.log("Api contactée pour supprimer un post");
   prisma.post
      .update({
         where: {
            id: parseInt(req.body.postId),
         },
         data: {
            enable: parseInt(req.body.signal),
         },
      })
      .then((post) => {
         res.status(200).json("post supprimé");
      })
      .catch((error) => res.status(500).json(error.message));
};
exports.supressComment = (req, res, next) => {
   console.log(req.body);
   console.log("Api contactée pour supprimer un commentaire");
   prisma.comment
      .update({
         where: {
            id: parseInt(req.body.commentId),
         },
         data: {
            enable: parseInt(req.body.signal),
         },
      })
      .then((comment) => {
         res.status(200).json("comment supprimé");
      })
      .catch((error) => res.status(500).json(error.message));
};
