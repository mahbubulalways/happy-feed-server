import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import notFoundRoute from "./app/middleware/notFoundRoute";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import applicationRoutes from "./app/routes";
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", applicationRoutes);
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Green Steps Server is under construction.OK?",
  });
});

app.use("*", notFoundRoute);
app.use(globalErrorHandler);
export default app;
