import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.js";
import Http from "http-status-codes";
cloudinary.config({
  cloud_name: "des1acmba",
  api_key: "641759972817119",
  api_secret: "md1SggQFFuhj9za6Hbsue0JAkKo",
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
      await User.updateOne(
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

export function setProfile(req, res) {
  const { photoId, photoVersion } = req.params;
  User.updateOne(
    { _id: req.user._id },
    {
      photoId: photoId,
      photoVersion: photoVersion,
    }
  )
    .then(() => {
      return res.status(Http.OK).json({ message: "photo updated" });
    })
    .catch((err) => {
      return res
        .status(Http.INTERNAL_SERVER_ERROR)
        .json({ message: "photo not updated" });
    });
}

export function deletePhoto(req, res) {
  const { photoId } = req.params;
  cloudinary.uploader.destroy(photoId, async (err, result) => {
    if (result.result === "ok") {
      await User.updateOne(
        { _id: req.user._id },
        {
          $pull: {
            photos: {
              photoId: photoId,
            },
          },
        }
      )
        .then(() => {
          return res.status(Http.OK).json({ message: "photo deleted" });
        })
        .catch((err) => {
          return res
            .status(Http.INTERNAL_SERVER_ERROR)
            .json({ message: "photo not deleted" });
        });
    }
  });
}
