import { Request, Response } from "express";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { CreateCandidatoUseCase } from "../usecases/create-candidato.usecase";
import { ListCandidatoUseCase } from "../usecases/list-candidato.usecase";

export class CandidatoController {
    public async create(req: Request, res: Response) {
        try {
            const { nome, username, senha } = req.body

            const usecase = new CreateCandidatoUseCase();
            const result = await usecase.execute({
                nome,
                username,
                senha
            });

            return res.status(201).send({
                ok: true,
                message: "Candidato criado com sucesso",
                data: result
            });

        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async list(req: Request, res: Response) {

        try {
            const usecase = new ListCandidatoUseCase(
                new UserRepository(),
                new CacheRepository()
            );
            const result = await usecase.execute();

            return res.status(200).send({
                ok: true,
                message: 'Listando todos os candidatos!',
                data: result
            })
            
        } catch (error: any) {
            
            return res.status(500).send({
                ok: false,
                message: error.toString()
            })

        }
    }
}
