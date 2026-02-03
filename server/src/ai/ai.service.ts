import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private logger = new Logger(AiService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY not found. AI features will fail or use mock fallback if implemented.');
    }
  }

  async generateRemediation(vulnerabilityTitle: string, assetType: string): Promise<string> {
    if (!this.openai) {
      this.logger.warn('Mocking response because OpenAI is not configured.');
      return this.getMockResponse(vulnerabilityTitle);
    }

    try {
      this.logger.log(`Generating remediation for: ${vulnerabilityTitle} on ${assetType}`);

      const prompt = `
You are a DevSecOps Expert and Terraform Architect.
Your task is to generate a Terraform resource block to remediate the following vulnerability: "${vulnerabilityTitle}" for a resource of type "${assetType}".

Rules:
1. PROHIBITED: Do not include markdown formatting (like \`\`\`hcl). Return ONLY the raw code.
2. PROHIBITED: Do not include explanations.
3. Use generic naming (e.g., 'this', 'main') or placeholders if ID is not known, but try to make it valid HCL.
4. If the vulnerability implies encryption, enable it.
5. If it implies public access, block it.
`;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: 'gpt-4o',
      });

      const content = completion.choices[0].message.content || '';
      // Strip markdown just in case the model ignores instructions
      return content.replace(/```hcl/g, '').replace(/```/g, '').trim();

    } catch (error) {
      this.logger.error('OpenAI API Call failed', error);
      throw new Error('Failed to generate remediation plan');
    }
  }

  private getMockResponse(title: string): string {
    if (title.includes('S3')) {
      return `# MOCK FALLBACK (Set OPENAI_API_KEY for real AI)
resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`;
    }
    return `# MOCK FALLBACK\n# Could not generate for ${title}`;
  }
}
