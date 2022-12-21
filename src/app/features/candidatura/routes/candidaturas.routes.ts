import { Router } from "express";
import { CandidaturaController } from "../controllers/list-candidatura.controller";

export const candidaturasRoutes = () => {

  const router = Router();

  router.get('/', new CandidaturaController().list);

  return router;

}
