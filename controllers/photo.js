import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.js";
import Http from "http-status-codes";
cloudinary.config({
  cloud_name: "des1acmba",
  api_key: "597783537724436",
  api_secret: "64N2vOAFwI34jjSvoMMXCY3emzk",
});
export function uploadPhoto(req, res) {
  const photo = req.body.photo;
  cloudinary.uploader.upload(
    photo,
    {
      transformation: {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
      },
    },
    async (err, result) => {
      console.log(result);
      User.updateOne(
        { _id: req.user._id },
        {
          $push: {
            photos: {
              photoVersion: result.version,
              photoId: result.public_id,
            },
          },
        }
      )
        .then(() => {
          return res.status(Http.OK).json({ message: "photo uploaded" });
        })
        .catch((err) => {
          return res
            .status(Http.INTERNAL_SERVER_ERROR)
            .json({ message: "photo not uploaded" });
        });
    }
  );
}
