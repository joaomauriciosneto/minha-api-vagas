import { ListCandidatoUseCase } from '../../../../../src/app/features/candidato/usecases/list-candidato.usecase';
import { UserRepository } from '../../../../../src/app/features/user/repositories/user.repository';
import { UsuarioModel } from '../../../../../src/app/models/usuario.model';
import { CacheRepository } from '../../../../../src/app/shared/repositories/cache.repository';
import { CacheConnection } from '../../../../../src/main/database/cache.connection';
import { DatabaseConnection } from '../../../../../src/main/database/typeorm.connection';

interface SutTypes {
  cacheRepository: CacheRepository;
  repository: UserRepository;
  sut: ListCandidatoUseCase;
}

const makeSut = (): SutTypes => {
  const cacheRepository = new CacheRepository();
  const repository = new UserRepository();
  const sut = new ListCandidatoUseCase(
    repository,
    cacheRepository,
  );

  return {sut, repository, cacheRepository}
}

describe('ListCandidatoUseCase -', () => {
  beforeAll(async () => {
    await DatabaseConnection.connect();
    await CacheConnection.connect();
  });

  afterEach(() => jest.clearAllMocks());

  afterAll(async () => {
    await DatabaseConnection.connection.destroy();
    await CacheConnection.connection.quit();
  });

  test('deve chamar o método find do UserRepository com os valores corretos', async () => {
    const { sut, repository } = makeSut();

    jest.spyOn(repository, 'find').mockResolvedValue([]);
    const observer = jest.spyOn(repository, 'find');

    await sut.execute();

    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenCalledWith('C');
  });

  test('deve retornar uma lista com instâncias de UsuarioModel convertida em json', async () => {
    const usuarioModel = new UsuarioModel(
      'any_name',
      'any_username',
      'any_pass',
      'any_type',
    );
    const usuarioModel2 = new UsuarioModel(
      'any_name_2',
      'any_username_2',
      'any_pass_2',
      'any_type_2',
    );
    const expected = [
      usuarioModel.toJson(),
      usuarioModel2.toJson(),
    ];

    const { sut, repository } = makeSut();

    jest.spyOn(repository, 'find').mockResolvedValue([
      usuarioModel,
      usuarioModel2,
    ]);

    const result = await sut.execute();

    expect(result).toEqual(expected);
  });
});
