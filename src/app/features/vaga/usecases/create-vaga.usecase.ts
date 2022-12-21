import { VagaModel } from "../../../models/vaga.model";
import { UserRepository } from "../../user/repositories/user.repository";
import { VagaRepository } from "../repositories/vaga.repository";

interface CreateVagaDTO {
  descricao: string;
  empresa: string;
  dtLimite: Date;
  indAtivo: boolean;
  maxCandidatos?: number;
  idRecrutador: string;
}

export class CreateVagaUseCase {
  readonly #userRepository: UserRepository;
  readonly #vagaRepository: VagaRepository;

  constructor(
    userRepository: UserRepository,
    vagaRepository: VagaRepository,
  ) {
    this.#userRepository = userRepository;
    this.#vagaRepository = vagaRepository;
  }

  public async execute(data: CreateVagaDTO) {
    const usuarioResult = await this.#userRepository.get(data.idRecrutador);

    if (!usuarioResult) {
      return null;
    }

    const vaga = new VagaModel(
      data.descricao,
      data.empresa,
      data.dtLimite,
      data.indAtivo,
      usuarioResult,
      data.maxCandidatos
    );

    const result = await this.#vagaRepository.create(vaga);

    return result.toJson();
  }
}
