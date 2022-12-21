import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { CandidaturaModel } from "../../../models/candidatura.model";
import { UsuarioModel } from "../../../models/usuario.model";
import { VagaModel } from "../../../models/vaga.model";
import { CandidaturaEntity } from "../../../shared/entities/candidatura.entity";

export class CandidaturaRepository {
    private repository =
        DatabaseConnection.connection.getRepository(CandidaturaEntity);

    public async create(candidatura: CandidaturaModel) {
        const candidaturaEntity = this.repository.create({
            idCandidato: candidatura.candidato.id,
            idVaga: candidatura.vaga.id,
            indSucesso: candidatura.indSucesso,
            dtCandidatura: candidatura.dtCandidatura,
        });

        await this.repository.save(candidaturaEntity);

        const result = await this.repository.findOneBy({
            idCandidato: candidatura.candidato.id,
            idVaga: candidatura.vaga.id,
        });

        return this.mapEntityToModel(result!);
    }

    public async list() {
        const result = await this.repository.find();

        const candidatos = result.map(item => {
            return this.mapEntityToModel(item)
        })

        return candidatos;
    }

    public async get(idCandidato: string, idVaga: string) {
        const result = await this.repository.findOneBy({
            idCandidato,
            idVaga,
        });

        if (!result) {
            return null;
        }

        return this.mapEntityToModel(result);
    }

    private mapEntityToModel(entity: CandidaturaEntity) {
        const candidato = UsuarioModel.create(
            entity.candidato.id,
            entity.candidato.nome,
            entity.candidato.username,
            entity.candidato.tipo,
            entity.candidato.senha,
            entity.candidato.empresa
        );

        const recrutadorVaga = UsuarioModel.create(
            entity.vaga.recrutador.id,
            entity.vaga.recrutador.nome,
            entity.vaga.recrutador.username,
            entity.vaga.recrutador.tipo,
            entity.vaga.recrutador.senha,
            entity.vaga.recrutador.empresa
        );

        const vaga = VagaModel.create(
            entity.vaga.id,
            entity.vaga.descricao,
            entity.vaga.recrutador.empresa,
            entity.vaga.dtLimite,
            entity.vaga.indAtivo,
            recrutadorVaga,
            entity.vaga.maxCandidatos
        );

        return new CandidaturaModel(
            candidato,
            vaga,
            entity.indSucesso,
            entity.dtCandidatura
        );
    }
}
