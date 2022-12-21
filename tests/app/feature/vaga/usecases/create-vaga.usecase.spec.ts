import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { VagaRepository } from '../../../../../src/app/features/vaga/repositories/vaga.repository';
import { CreateVagaUseCase } from '../../../../../src/app/features/vaga/usecases/create-vaga.usecase';
import { UsuarioModel } from '../../../../../src/app/models/usuario.model';
import { VagaModel } from '../../../../../src/app/models/vaga.model';
import { DatabaseConnection } from '../../../../../src/main/database/typeorm.connection';

interface SutTypes {
  userRepository: UserRepository;
  vagaRepository: VagaRepository;
  sut: CreateVagaUseCase;
}

const makeSut = (): SutTypes => {
  const userRepository = new UserRepository();
  const vagaRepository = new VagaRepository();
  const sut = new CreateVagaUseCase(
    userRepository,
    vagaRepository,
  );

  return { userRepository, vagaRepository, sut };
}

describe('CreateVagaUseCase - ', () => {
  const createVagaDto = {
    descricao: 'any_description',
    empresa: 'any_company',
    dtLimite: new Date(),
    indAtivo: true,
    idRecrutador: 'any_id',
  };

  beforeAll(async () => {
    await DatabaseConnection.connect();
  });

  afterEach(() => jest.clearAllMocks());

  afterAll(async () => {
    await DatabaseConnection.connection.destroy();
  });

  test('deve chamar o método get do userRepository com os valores corretos', async () => {
    const { sut, userRepository } = makeSut();

    jest.spyOn(userRepository, 'get').mockResolvedValue(null);
    const observer = jest.spyOn(userRepository, 'get');

    await sut.execute(createVagaDto);

    expect(observer).toBeCalledTimes(1);
    expect(observer).toBeCalledWith(createVagaDto.idRecrutador);
  });

  test('deve chamar o método create do vagaRepository com os valores corretos', async () => {
    const usuarioModel = new UsuarioModel("name", "username", "pass", "type");
    const vagaModel = new VagaModel(
      createVagaDto.descricao,
      createVagaDto.empresa,
      createVagaDto.dtLimite,
      createVagaDto.indAtivo,
      usuarioModel,
    );

    const { sut, userRepository, vagaRepository } = makeSut();

    jest.spyOn(userRepository, 'get').mockResolvedValue(usuarioModel);
    jest.spyOn(vagaRepository, 'create').mockResolvedValue(vagaModel);
    const observer = jest.spyOn(vagaRepository, 'create');

    await sut.execute(createVagaDto);

    expect(observer).toHaveBeenCalledTimes(1);
  });

  test('deve retornar null quando não encontrar nenhum usuário com o id enviado no DTO', async () => {
    const { userRepository, sut } = makeSut();

    jest.spyOn(userRepository, 'get').mockResolvedValue(null);

    const result = await sut.execute(createVagaDto);

    expect(result).toEqual(null);
  });

  test('deve retornar uma instancia de VagaModel em json, quando for possível criar a vaga', async () => {
    const usuarioModel = new UsuarioModel("name", "username", "pass", "type");
    const vagaModel = new VagaModel(
      createVagaDto.descricao,
      createVagaDto.empresa,
      createVagaDto.dtLimite,
      createVagaDto.indAtivo,
      usuarioModel,
    );
    const { sut, userRepository, vagaRepository } = makeSut();

    jest.spyOn(userRepository, 'get').mockResolvedValue(usuarioModel);
    jest.spyOn(vagaRepository, 'create').mockResolvedValue(vagaModel);

    const result = await sut.execute(createVagaDto);

    expect(result).toEqual(vagaModel.toJson());
  });

  test('deve continuar o lançamento de um erro, quando o mesmo for lançado por qualquer um dos repositórios', async () => {
    const { userRepository, sut } = makeSut();
    const error = new Error();

    jest.spyOn(userRepository, 'get').mockRejectedValue(new Error());

    const result = sut.execute(createVagaDto);

    await expect(result).rejects.toThrowError(new Error());
  });
});