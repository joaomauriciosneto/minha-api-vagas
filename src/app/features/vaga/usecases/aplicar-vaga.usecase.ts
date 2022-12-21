import { CandidaturaModel } from "../../../models/candidatura.model";
import { CandidaturaRepository } from "../../candidatura/repositories/candidatura.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { VagaRepository } from "../repositories/vaga.repository";

interface AplicarVagaDTO {
    idCandidato: string;
    idVaga: string;
    indSucesso: boolean;
}

export class AplicarVagaUseCase {
    public async execute(data: AplicarVagaDTO) {
        const vagaRepository = new VagaRepository();
        const userRepository = new UserRepository();

        // Verifica usuario
        const candidato = await userRepository.get(data.idCandidato);
        if (!candidato) {
            return null;
        }

        // Verifica vaga
        const vaga = await vagaRepository.find(data.idVaga);
        if (!vaga) {
            return null;
        }

        const candidaturaRepository = new CandidaturaRepository();

        // Verificar se usuario ja esta na vaga
        const usuarioVaga = await candidaturaRepository.get(
            data.idCandidato,
            data.idVaga
        );
        if (usuarioVaga) {
            throw new Error("Candidato já está aplicado nesta vaga");
        }

        // Valida se vaga está ativa
        if (!vaga.indAtivo) {
            throw new Error("A vaga não está ativa");
        }

        // Verifica se a data limite da vaga já foi alcançada
        if (vaga.dtLimite < new Date()) {
            throw new Error(
                "A vaga não está mais aceitando candidaturas devido ao prazo"
            );
        }

        const candidatura = new CandidaturaModel(
            candidato,
            vaga,
            data.indSucesso,
            new Date()
        );

        const result = await candidaturaRepository.create(candidatura);

        return result.toJson();
    }
}
