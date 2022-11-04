import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, verifySecretToken } from './util/util';
const isImageUrl = require('is-image-url');


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  app.get("/filteredimage", async (req: Request, res: Response) => {

    const image_url: string = req.query.image_url;
    const filtered_image_url = await filterImageFromURL(image_url);

    try {
      if (!verifySecretToken(req)) {
        res.status(403).send({ message: 'Invalid token!' });
      }
      if (!image_url) {
        res.status(442).send({ message: 'Valid Image URL must be provide' });
      }
      if (!isImageUrl(image_url)) {
        res.status(442).send({ message: 'Valid Image URL must be provide' });
      }
      res.sendFile(filtered_image_url, () =>
        deleteLocalFiles([filtered_image_url])
      );
    } catch (error) {
      res.status(500).send({ message: 'Cant handle the request!' })
    }
  });



  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();