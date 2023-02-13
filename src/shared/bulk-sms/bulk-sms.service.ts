import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BulkSmsService {
  private logger = new Logger(BulkSmsService.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * BULK SMS METHODS
   * sentSingleSms
   */
  public sentSingleSms(phoneNo: string, message: string) {
    const username = this.configService.get<string>('smsSenderUsername');
    const password = this.configService.get<string>('smsSenderPassword');
    const senderId = this.configService.get<string>('smsSenderId');

    const url =
      'http://66.45.237.70/api.php?username=' +
      username +
      '&password=' +
      password +
      '&number=' +
      phoneNo +
      '&message=' +
      message;

    this.httpService.post<{ data: string }>(url, {}).subscribe(
      (res) => {
        this.logger.log(res.data);
      },
      (error) => {
        this.logger.error(error);
      },
    );
  }
}
