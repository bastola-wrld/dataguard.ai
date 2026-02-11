import { Injectable } from '@nestjs/common';
import { CloudProvider, CloudAsset } from './cloud.interface';

@Injectable()
export class MockAwsService implements CloudProvider {
    async scan(credentials: any): Promise<CloudAsset[]> {
        console.log('Mock scanning with credentials:', credentials);
        // Simulate latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return [
            {
                cloudId: 'arn:aws:s3:::prod-customer-data',
                name: 'prod-customer-data',
                type: 'S3',
                region: 'us-east-1',
                provider: 'AWS',
                metadata: { encrypted: true, publicAccess: false },
            },
            {
                cloudId: 'arn:aws:s3:::dev-public-assets',
                name: 'dev-public-assets',
                type: 'S3',
                region: 'us-west-2',
                provider: 'AWS',
                metadata: { encrypted: false, publicAccess: true },
            },
            {
                cloudId: 'i-0abcdef1234567890',
                name: 'web-server-prod',
                type: 'EC2',
                region: 'us-east-1',
                provider: 'AWS',
                metadata: { instanceType: 't3.micro', publicIp: '1.2.3.4' },
            },
            {
                cloudId: 'arn:aws:rds:us-east-1:123456789012:db:customer-db',
                name: 'customer-db',
                type: 'RDS',
                region: 'us-east-1',
                provider: 'AWS',
                metadata: { engine: 'postgres', publiclyAccessible: true, storageEncrypted: false },
            },
        ];
    }
}
