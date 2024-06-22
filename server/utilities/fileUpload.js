import path from "path";
import multer from "multer";

const fileUpload = () => {
  const storageEngine = multer.diskStorage({
    destination: "server/public/images/user-images",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  });
  return upload.single("image");
};

//@this function used to validate the uploaded file

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

export default fileUpload;
