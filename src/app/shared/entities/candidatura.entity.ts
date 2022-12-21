import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { VagaEntity } from "./vaga.entity";

@Entity({
    name: "candidatura",
})
export class CandidaturaEntity {
    @PrimaryColumn({
        name: "id_candidato",
    })
    idCandidato: string;

    @PrimaryColumn({
        name: "id_vaga",
    })
    idVaga: string;

    @Column({
        name: "id_sucesso",
    })
    indSucesso: boolean;

    @Column()
    dtCandidatura: Date;

    @ManyToOne(() => UserEntity, {
        eager: true,
    })
    @JoinColumn({
        name: "id_candidato",
    })
    candidato: UserEntity;

    @ManyToOne(() => VagaEntity, {
        eager: true,
    })
    @JoinColumn({
        name: "id_vaga",
    })
    vaga: VagaEntity;
}
