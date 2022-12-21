import { CandidatoModel } from "./candidato.model";
import { VagaModel } from "./vaga.model";

export class CandidaturaModel {
    constructor(
        private _candidato: CandidatoModel,
        private _vaga: VagaModel,
        private _indSucesso: boolean,
        private _dtCandidatura: Date
    ) {}

    public get candidato() {
        return this._candidato;
    }

    public get vaga() {
        return this._vaga;
    }

    public get indSucesso() {
        return this._indSucesso;
    }

    public get dtCandidatura() {
        return this._dtCandidatura;
    }

    public toJson() {
        return {
            candidato: this._candidato.toJson(),
            vaga: this._vaga.toJson(),
            indSucesso: this._indSucesso,
            dtCandidatura: this._dtCandidatura,
        };
    }
}
