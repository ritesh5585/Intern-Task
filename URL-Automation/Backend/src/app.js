import express from 'express'
import urlRouter from "./routes/Url.routes.js"

const app = express();

app.use(express.json());

app.use("/api", urlRouter)

export default app
