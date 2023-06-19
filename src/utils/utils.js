
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

const validateNumber = (number) => {
    return number && !isNaN(number) && number > 0;
  };
  
  export { validateNumber };


import { connect } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://rechleandroluis1:sebaquerido@futsal.n8iawow.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Conexión exitosa");
  } catch (e) {
    console.log(e);
    throw "No ha podido conectarse";
  }
}


