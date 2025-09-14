import { getRepositories } from "../data-source"
import { Curriculum } from "../entity/Curriculum"

class CurriculumService {
  private static instance: CurriculumService
  private repositories = getRepositories()

  static getInstance(): CurriculumService {
    if (!CurriculumService.instance) {
      CurriculumService.instance = new CurriculumService()
    }
    return CurriculumService.instance
  }

  async createCurriculum(data: {
    title: string
    description?: string
    fileName: string
    fileUrl: string
    fileSize: number
    mimeType: string
  }): Promise<Curriculum> {
    const curriculum = this.repositories.curriculum.create(data)
    return await this.repositories.curriculum.save(curriculum)
  }

  async getAllCurriculums(page: number = 0, limit: number = 10): Promise<{
    contents: Curriculum[]
    total: number
    page: number
    limit: number
  }> {
    const [contents, total] = await this.repositories.curriculum.findAndCount({
      skip: page * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    })

    return {
      contents,
      total,
      page,
      limit
    }
  }

  async getCurriculum(id: number): Promise<Curriculum | null> {
    return await this.repositories.curriculum.findOne({
      where: { id }
    })
  }

  async updateCurriculum(id: number, data: {
    title?: string
    description?: string
  }): Promise<Curriculum | null> {
    await this.repositories.curriculum.update(id, data)
    return await this.getCurriculum(id)
  }

  async deleteCurriculum(id: number): Promise<boolean> {
    const result = await this.repositories.curriculum.softDelete(id)
    return result.affected !== undefined && result.affected > 0
  }
}

export default CurriculumService
