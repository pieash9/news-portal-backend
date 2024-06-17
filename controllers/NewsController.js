import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import {
  generateRandomNum,
  imageValidator,
  removeImage,
  uploadImage,
} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
  static async index(req, res) {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 2;

    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      take: limit,
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    const newsTransform = news?.map((item) => NewsApiTransform.transform(item));

    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);

    return res.json({
      status: 200,
      metaData: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
      data: newsTransform,
    });
  }

  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ errors: { message: "Image is required." } });
      }

      const image = req.files?.image;
      //   image custom validator
      const message = imageValidator(image?.size, image?.mimetype);

      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      //   image upload
      const imageName = uploadImage(image);

      payload.image = imageName;
      payload.user_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      return res.json({ status: 200, message: "News created", data: news });
    } catch (error) {
      console.log({ error });
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again!",
        });
      }
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });

      return res.json({
        status: 200,
        data: news ? NewsApiTransform.transform(news) : null,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);
      const image = req?.files?.image;

      if (image) {
        const message = imageValidator(image?.size, image?.mimetype);
        if (message !== null) {
          return res.status(400).json({
            errors: {
              image: message,
            },
          });
        }
        // upload new image
        const imageName = uploadImage(image);
        payload.image = imageName;

        // delete old image
        removeImage(news.image);
      }

      const updatedNews = await prisma.news.update({
        where: {
          id: Number(id),
        },
        data: payload,
      });

      return res
        .status(200)
        .json({ message: "News updated", data: updatedNews });
    } catch (error) {
      console.log({ error });
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again!",
        });
      }
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // delete image from filesystem
      removeImage(news.image);

      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({ message: "News deleted" });
    } catch (error) {
      console.log({ error });
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again!",
        });
      }
    }
  }
}

export default NewsController;
