export interface CloudAsset {
    cloudId: string;
    name: string;
    type: string;
    region: string;
    provider: 'AWS' | 'GCP' | 'AZURE';
    metadata?: any;
}

export interface CloudProvider {
    scan(credentials: any): Promise<CloudAsset[]>;
}
