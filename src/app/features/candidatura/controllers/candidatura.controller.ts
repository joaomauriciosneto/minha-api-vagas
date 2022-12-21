import { Request, Response } from "express";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { serverError, success } from "../../../shared/util/response.helper";
import { CandidaturaRepository } from "../repositories/candidatura.repository";
import { ListCandidaturasUseCase } from "../usecases/list-candidaturas.usecase";

export class CandidaturaController {
  public async list(req: Request, res: Response) {
    try {

      const usecase = new ListCandidaturasUseCase(
        new CandidaturaRepository(),
        new CacheRepository()
      )      
      const result = await usecase.execute();

      return success(res, result, 'Listando todas as candidaturas')
      
    } catch (error: any) {
      
      return serverError(res, error)

    }
  }
}
