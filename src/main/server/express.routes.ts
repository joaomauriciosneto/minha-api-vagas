import { Router, Express } from "express";
import { candidatoRoutes } from "../../app/features/candidato/routes/candidato.routes";
import { candidaturasRoutes } from "../../app/features/candidatura/routes/candidaturas.routes";
import { loginRoutes } from "../../app/features/login/routes/login.routes";
import { recrutadorRoutes } from "../../app/features/recrutador/routes/recrutador.routes";
import { vagaRoutes } from "../../app/features/vaga/routes/vaga.routes";

export const createRoutes = (app: Express) => {
    app.get("/", (req, res) => {
        return res.status(200).send({
            ok: true,
            message: "Tudo ok!",
        });
    });

    app.use("/recrutador", recrutadorRoutes());
    app.use("/auth", loginRoutes());
    app.use("/candidato", candidatoRoutes());
    app.use("/vaga", vagaRoutes());
    app.use('/candidatura', candidaturasRoutes());
};
