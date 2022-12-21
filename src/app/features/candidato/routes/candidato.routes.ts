import { Router } from "express";
import { CandidatoController } from "../controllers/candidato.controller";
import { createCandidatoValidator } from "../validators/create-candidato.validator";

export const candidatoRoutes = () => {
  const router = Router();

  router.post("/", [createCandidatoValidator],new CandidatoController().create);

  router.get('/', new CandidatoController().list);

  return router;
};
