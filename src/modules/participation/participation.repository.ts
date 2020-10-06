import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Participation } from './participation.dto';
import { ParticipationEntity } from './participation.entity';

@EntityRepository(ParticipationEntity)
export class ParticipationRepository extends Repository<ParticipationEntity> {
  private readonly logger = new Logger(ParticipationRepository.name);

  cancelParticipation = async (
    activity_id: string,
    participant_id: number,
  ): Promise<void> => {
    const participation = await this.findOne({
      where: {
        activity_id,
        participant_id,
      },
    });
    if (!participation) throw new Error("Participation doesn't exist");

    await this.softRemove(participation);
    return Promise.resolve();
  };

  createParticipation = async (
    activity_id: string,
    participant_id: number,
  ): Promise<Participation> => {
    const participation = await this.findOne({
      where: { activity_id, participant_id },
      withDeleted: true,
    });
    if (participation) {
      this.logger.log(
        `User ${participant_id} already joined activity ${activity_id}`,
      );
      throw new Error('User already joined the activity');
    }

    const newParticipation = await this.save({ activity_id, participant_id });
    return plainToClass(Participation, newParticipation);
  };

  removeParticipationList = async (activity_id: string): Promise<void> => {
    const participationList = await this.find({ where: { activity_id } });

    await this.softRemove(participationList);
    return Promise.resolve();
  };
}
