export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 dark:text-zinc-300">
            <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Terms of Service</h1>
            <p className="mb-4 text-sm text-zinc-500">Last updated: February 11, 2026</p>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">1. Acceptance of Terms</h2>
                <p>By accessing or using DataGuard.ai, you agree to be bound by these Terms of Service. If you do not agree, you may not use our platform.</p>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">2. Use of Service</h2>
                <p>DataGuard.ai provides security analysis for cloud infrastructure. You are responsible for ensuring you have the legal right to grant us access to the cloud accounts you connect.</p>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">3. Limitation of Liability</h2>
                <p>DataGuard.ai provides AI-generated remediation code. You must review all generated code before applying it to production environments. We are not liable for infrastructure downtime or data loss resulting from applied fixes.</p>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">4. Modifications</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
            </section>
        </div>
    );
}
