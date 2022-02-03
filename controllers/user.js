const bcrypt = require("bcrypt"); //for crypting the password
const jwt = require("jsonwebtoken");

const { passwordStrength } = require("check-password-strength"); // check the password strength
const bouncer = require("express-bouncer")(500, 3600000); // for brute force protection
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.hello = (req, res, next) => {
   res.send("Hello from user controller Prisma is doing his best :)");
};
exports.signup = (req, res, next) => {
   // check if email is already used
   console.log("Api contactée pour inscription");
   console.log("Vérification adresse mail unique");
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
            if (passwordStrengthResult.id <= 1) {
               // if the password is too weak, reject the request
               res.status(400).json({
                  error: "Votre mot de passe est trop faible",
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
   if (req.file) {
      console.log("yolo");
      const fileObject = req.file
         ? {
              ...JSON.parse(req.body.user),
              mediaUrl: `${req.protocol}://${req.get("host")}/images/profile/${req.file.filename}`,
           }
         : { ...req.body };
      prisma.user
         .findUnique({
            where: {
               id: req.body.userId,
            },
         })
         .then((user) => {
            if (user.profilepicurl) {
               const oldImageUrl = user.profilepicurl.split("/images/profile/")[1];
               fs.unlink(`images/profile/${oldImageUrl}`, (error) => {
                  console.log(error);
               });
            }
         });
      prisma.user
         .update({
            where: {
               _id: req.body.userId,
            },
            data: {
               ...fileObject,
               name: req.body.firstName,
               surname: req.body.lastName,
               workplace: req.body.workplace,
            },
         })

         .then((user) => {
            res.status(200).json({
               message: "Utilisateur modifié",
               userId: user.id,
               userFirstName: user.name,
               userLastName: user.surname,
               userWorkplace: user.workplace,
               userMediaUrl: user.profilepicurl,
               mod: user.isamod,
            });
         })
         .catch((error) => res.status(500).json({ error }));
      console.log(error);
   }
   // if there is a new image , delete the old one

   // update the user with new name and surname, and the new image
   if (!req.file && req.body.mediaurl !== null) {
      console.log(req.body);
      console.log("it works 1 ?");
      prisma.user
         .update({
            where: {
               id: req.body.userId,
            },
            data: {
               name: req.body.firstName,
               surname: req.body.lastName,
               workplace: req.body.workPlace,
               profilepicurl: req.body.mediaurl,
               isamod: req.body.mod,
            },
         })

         .then((user) => {
            res.status(200).json({
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

      // .catch((error) => res.status(500).json({ error }));
   } else {
      console.log(req.body);
      prisma.user
         .update({
            where: {
               id: req.body.userId,
            },
            data: {
               name: req.body.firstName,
               surname: req.body.lastName,
               workplace: req.body.workPlace,
               isamod: req.body.mod,
            },
         })

         .then((user) => {
            res.status(200).json({
               message: "Utilisateur modifié",
               userId: user.id,
               userFirstName: user.name,
               userLastName: user.surname,
               userWorkplace: user.workplace,
               userMediaUrl: user.profilepicurl,
               mod: user.isamod,
            });
            console.log("utilisateur modidié !");
         })
         .catch((error) => res.status(500).json({ error }));
   }
};
exports.getOne = (req, res, next) => {
   console.log("Api contactée pour récupération d'un utilisateur");
   prisma.user
      .findOne({
         where: {
            id: req.params.id,
         },
      })
      .then((user) => {
         if (!user) {
            res.status(404).json({ error: "Utilisateur non trouvé !" });
            return;
         }
         res.status(200).json({
            userFirstName: user.name,
            userLastName: user.surname,
            userWorkplace: user.workplace,
            userMediaUrl: user.profilepicurl,
         });
      })
      .catch((error) => res.status(500).json({ error }));
};
