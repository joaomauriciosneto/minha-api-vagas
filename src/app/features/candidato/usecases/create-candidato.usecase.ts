import { CandidatoModel } from "../../../models/candidato.model";
import { UsuarioModel } from "../../../models/usuario.model";
import { UserRepository } from "../../user/repositories/user.repository";

interface CreateCandidatoDTO {
  nome: string;
  username: string;
  senha: string;
}

export class CreateCandidatoUseCase {
  public async execute(data: CreateCandidatoDTO) {
    const candidato = new CandidatoModel(
      data.nome,
      data.username,
      data.senha,
    )

    const repository = new UserRepository();
    const result = await repository.create(candidato);

    return result.toJson();
  }
}