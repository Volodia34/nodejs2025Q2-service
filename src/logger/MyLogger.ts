import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class MyLogger extends ConsoleLogger {}
