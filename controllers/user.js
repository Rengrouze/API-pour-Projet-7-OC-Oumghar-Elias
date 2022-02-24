const bcrypt = require("bcrypt"); //for crypting the password
const jwt = require("jsonwebtoken"); // for the Token
const { passwordStrength } = require("check-password-strength"); // check the password strength
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.hello = (req, res, next) => {
   res.send("Hello from user controller, Prisma is doing his best :)");
};
exports.signup = (req, res, next) => {
   // check if email is already used
   console.log("Api contactée pour inscription");

   prisma.user
      .findUnique({
         where: {
            email: req.body.email,
         },
      })
      .then((user) => {
         if (user) {
            res.status(400).json({
               error: "Email déjà utilisé !",
            });
            console.log("Email dèjà utilisé");
         } else {
            // check if password is strong enough
            console.log("Vérification force du mot de passe");
            const passwordStrengthResult = passwordStrength(req.body.password);
            if (passwordStrengthResult.id < 1) {
               // if the password is too weak, reject the request
               res.status(400).json({
                  error: "Votre mot de passe est trop faible (minimum 6 caractères et au moins 1 majuscule ou 1 chiffre)",
               });
               console.log("Mot de passer trop faible");
               return;
            }
            console.log("Mot de passe reçu, hash du mot de passe");
            bcrypt
               .hash(req.body.password, 10)
               .then((hash) => {
                  console.log("récupération du nom et prénom");
                  console.log(req.body);
                  prisma.user
                     .create({
                        data: {
                           email: req.body.email,
                           password: hash,
                           name: req.body.name,
                           surname: req.body.surName,
                        },
                     })

                     .then(() => {
                        prisma.user
                           .findUnique({
                              where: {
                                 email: req.body.email,
                              },
                           })
                           .then((user) => {
                              if (!user) {
                                 res.status(401).json({ error: "Utilisateur non trouvé !" });
                                 return;
                              }
                              bcrypt
                                 .compare(req.body.password, user.password)
                                 .then((valid) => {
                                    if (!valid) {
                                       res.status(401).json({ error: "Mot de passe incorrect !" });
                                       return;
                                    }
                                    const token = jwt.sign({ userId: user.id, email: user.email }, "RANDOM_TOKEN_SECRET", {
                                       expiresIn: "24h",
                                    });

                                    res.status(201).json({
                                       userId: user.id,
                                       userFirstName: user.name,
                                       userLastName: user.surname,
                                       userWorkplace: user.workplace,
                                       userMediaUrl: user.profilepicurl,
                                       mod: user.isamod,
                                       token: token,
                                    });
                                 })
                                 .catch((error) => res.status(500).json({ error }));
                           });
                     })

                     .catch((error) => {
                        console.log("error", error);
                        res.status(400).json({ error });
                     });
                  console.log("Utilisateur créé");
               })
               .catch((error) => res.status(500).json({ message: "Erreur lors de la création de l'utilisateur !" }));
         }
      });

   // check the password strength
};

exports.login = (req, res, next) => {
   console.log("Api contactée pour connexion");
   // check if the user exists, and if the password is correct, give a random secret token
   prisma.user
      .findUnique({
         where: {
            email: req.body.email,
         },
      })
      .then((user) => {
         if (!user) {
            res.status(401).json({ error: "Utilisateur non trouvé !" });
            return;
         }
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  res.status(401).json({ error: "Mot de passe incorrect !" });
                  return;
               }
               const token = jwt.sign({ userId: user.id, email: user.email }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" });

               res.status(200).json({
                  userId: user.id,
                  userFirstName: user.name,
                  userLastName: user.surname,
                  userWorkplace: user.workplace,
                  userMediaUrl: user.profilepicurl,
                  mod: user.isamod,
                  token: token,
               });
            })
            .catch((error) => res.status(500).json({ error }));
      });
};

exports.update = (req, res, next) => {
   console.log("Api contactée pour modification");

   //  if there is a file, update the user with the file
   const profilepicurl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : req.body.mediaurl;

   prisma.user
      .update({
         where: {
            id: parseInt(req.body.userId),
         },
         data: {
            name: req.body.firstName,
            surname: req.body.lastName,
            workplace: req.body.workPlace,
            profilepicurl,
            isamod: parseInt(req.body.mod),
         },
      })

      .then((user) => {
         res.status(201).json({
            message: "Utilisateur modifié",
            userId: user.id,
            userFirstName: user.name,
            userLastName: user.surname,
            userWorkplace: user.workplace,
            userMediaUrl: user.profilepicurl,
            mod: user.isamod,
         });
         console.log("it works  ?");
      })

      //in case of error send the error message
      .catch((error) => {
         console.log(error);
         res.status(500).json({ error });
      });
};
exports.delete = (req, res, next) => {
   console.log("Api contactée pour suppression");
   // delete the user and every post and comment associated to it

   (async () => {
      try {
         const deleteReportedPosts = prisma.reported_post.deleteMany({
            where: {
               user__id: parseInt(req.body.userId),
            },
         });
         const deleteLikedPosts = prisma.liked_post.deleteMany({
            where: {
               user__id: parseInt(req.body.userId),
            },
         });
         const deleteComments = prisma.comment.deleteMany({
            where: {
               user__id: parseInt(req.body.userId),
            },
         });
         const deletePosts = prisma.post.deleteMany({
            where: {
               op: parseInt(req.body.userId),
            },
         });
         const deleteUser = prisma.user.delete({
            where: {
               id: parseInt(req.body.userId),
            },
         });
         const transaction = await prisma
            .$transaction([deleteReportedPosts, deleteLikedPosts, deleteComments, deletePosts, deleteUser])
            .then((data) => {
               console.log("transaction success");
               res.status(200).json({ message: "Utilisateur supprimé" });
            });
      } catch (error) {
         console.log(error);
         res.status(500).json({ error });
      }
   })();
};
