export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 dark:text-zinc-300">
            <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Privacy Policy</h1>
            <p className="mb-4 text-sm text-zinc-500">Last updated: February 11, 2026</p>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">1. Information We Collect</h2>
                <p>At DataGuard.ai, we collect information necessary to provide autonomous cloud security services. This includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Account credentials (email, hashed passwords).</li>
                    <li>Cloud infrastructure metadata required for security analysis.</li>
                    <li>Usage logs and interaction data.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">2. How We Use Your Data</h2>
                <p>Your data is used exclusively to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Identify security vulnerabilities in your connected cloud environments.</li>
                    <li>Generate remediation plans via AI agents.</li>
                    <li>Improve our security detection algorithms.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">3. Data Security</h2>
                <p>We implement industry-standard encryption for all data at rest and in transit. Cloud credentials provided to DataGuard are stored in secure, encrypted vaults.</p>

                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">4. Contact Us</h2>
                <p>If you have questions about this policy, contact us at security@dataguard.ai.</p>
            </section>
        </div>
    );
}
