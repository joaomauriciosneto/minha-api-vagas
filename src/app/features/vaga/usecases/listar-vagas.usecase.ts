import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { VagaRepository } from "../repositories/vaga.repository";

export class ListarVagasUseCase {
  constructor(
    private repository: VagaRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute() {
    const cachedList = await this.cacheRepository.get('vagas');
    if(cachedList) {
      return cachedList;
    }

    const result = await this.repository.list();
    const resultJson = result.map(item => item.toJson());

    await this.cacheRepository.set('vagas', resultJson);

    return resultJson;
  }
}
