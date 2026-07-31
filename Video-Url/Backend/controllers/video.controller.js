export const uploadVideo = (req, res) => {
  try {
    const { companyName, productName } = req.body;

    if (!companyName || !productName || !req.file) {
      return res.status(400).json({
        message: "Company name, product name and video are required.",
      });
    }
    const companySlug = slugify(companyName);
    const productSlug = slugify(productName);

    const downloadUrl = `http://localhost:5173/${companySlug}/${productSlug}`;

    /*
      Store mapping for now.

      Later we'll make this persistent/database-backed.
      */

    const metadata = {
      companyName,
      productName,
      companySlug,
      productSlug,
      fileName: req.file.filename,
      originalName: req.file.originalname,
    };

    const metadataFile = path.join(
      uploadDir,
      `${companySlug}_${productSlug}.json`,
    );

    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    res.json({
      success: true,
      url: downloadUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Upload failed.",
    });
  }
};

export const getDownloadUrl = (req, res) => {
  try {
    const { company, product } = req.params;

    const metadataFile = path.join(uploadDir, `${company}_${product}.json`);

    if (!fs.existsSync(metadataFile)) {
      return res.status(404).send("Video not found.");
    }

    const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));

    const videoPath = path.join(uploadDir, metadata.fileName);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("Video file not found.");
    }

    res.download(videoPath, metadata.originalName);
  } catch (error) {
    console.error(error);

    res.status(500).send("Download failed.");
  }
};