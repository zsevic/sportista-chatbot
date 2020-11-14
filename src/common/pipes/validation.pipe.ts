import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  private readonly logger = new Logger(CustomValidationPipe.name);

  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const response: any = e.getResponse();
        const messages = response.message
          .map((message) =>
            message.constraints ? Object.values(message.constraints) : message,
          )
          .flat();
        this.logger.error(JSON.stringify(messages));

        throw new BadRequestException(messages);
      }
    }
  }
}
