import { ILike } from "typeorm";
import { getRepositories } from "../data-source";

class DictionaryService {
  private static instance: DictionaryService;
  private readonly repositories = getRepositories();
  private constructor() { }

  public static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  async createDictionary(data: {
    word: string;
    pronunciation?: string;
    definition: string;
    images?: string;
    type: number;
  }) {
    const dictionary = this.repositories.dictionary.create(data);
    return await this.repositories.dictionary.save(dictionary);
  }

  async updateDictionary(id: number, data: {
    word?: string;
    pronunciation?: string;
    definition?: string;
    images?: string;
    type?: number;
  }) {
    const dictionary = await this.repositories.dictionary.findOne({ where: { id } });
    if (!dictionary) {
      throw new Error('Dictionary not found');
    }
    Object.assign(dictionary, data);
    return await this.repositories.dictionary.save(dictionary);
  }

  async getAllWords(page = 0, limit = 10) {
    const [words, total] = await this.repositories.dictionary.findAndCount({
      skip: page * limit,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    return {
      contents: words,
      total,
      page,
      limit
    };
  }

  async deleteDictionary(id: number) {
    const dictionary = await this.repositories.dictionary.findOne({ where: { id } });
    if (!dictionary) {
      throw new Error('Dictionary not found');
    }
    return await this.repositories.dictionary.softDelete(id);
  }

  async getDictionary(id: number) {
    return await this.repositories.dictionary.findOne({ where: { id } });
  }

  async findWords(word: string, type: number) {
    return await this.repositories.dictionary.find({
      where: {
        word: ILike(`%${word}%`),
        type
      }
    });
  }


  async count() {
    const english = await this.repositories.dictionary.count({ where: { type: 0 } });
    const vietnamese = await this.repositories.dictionary.count({ where: { type: 1 } });
    return { english, vietnamese, total: english + vietnamese };
  }
}
export default DictionaryService;