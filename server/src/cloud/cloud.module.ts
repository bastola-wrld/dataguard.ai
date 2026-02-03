import { Module } from '@nestjs/common';
import { MockAwsService } from './mock-aws.service';

@Module({
    providers: [
        {
            provide: 'CloudProvider',
            useClass: MockAwsService,
        },
    ],
    exports: ['CloudProvider'],
})
export class CloudModule { }
