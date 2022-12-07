const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "images/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + uniqueSuffix);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})

const uploader = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const supportedImage = /png|jpg/;
        // for extension
        const extension = path.extname(file.originalname);

        if(supportedImage.test(extension)){
            cb(null, true);
        } else{
            cb(new Error("Must be a png/jpg image"));
        }
    },
    limits: {
        fileSize: 500000, // 5mb = 5 * 1000 * 1000
    }
});

module.exports = uploader;