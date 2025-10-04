





import { appConfig } from 'root/project.config';
import { generateMetadata } from '~/utils/seo';

export const metadata = generateMetadata({
    title: 'Privacy Policy',
    description: 'Privacy Policy for Your Name — portfolio site. Explains what data is collected and how it is used.',
    url: '/legal/privacy',
    keywords: ['privacy policy', 'portfolio', 'personal site', 'cookies', 'adsense'],
});

const PrivacyPolicyPage: React.FC = () => {
    return (
        <main title="Privacy Policy" className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-semibold mb-6">
                Privacy Policy

            </h1>
            <article className="prose prose-lg dark:prose-invert">

                <section>
                    <h2>1. Data We Collect</h2>
                    <ul>
                        <li><strong>Automatically collected:</strong> anonymized analytics (page views, referrers, device info).</li>
                        <li><strong>Cookies & similar:</strong> session cookies, persistent cookies used for analytics and ads.</li>
                        <li><strong>User-provided:</strong> contact form submissions (name, email, message) — stored only to reply.</li>
                        <li><strong>Third-party:</strong> data collected by third-party services you access on this Site (Google Analytics, Google AdSense).</li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Data</h2>
                    <ul>
                        <li>Operate and maintain the Site.</li>
                        <li>Improve site performance and user experience via anonymized analytics.</li>
                        <li>Deliver advertisements via Google AdSense (if enabled) — see the Ads section below.</li>
                        <li>Respond to contact requests.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Cookies & Tracking</h2>
                    <p>
                        We use cookies and similar technologies. You can disable cookies in your browser, but some features may not
                        work correctly. Third-party services used on the Site may also set cookies (for example, Google services).
                    </p>
                </section>

                <section>
                    <h2>4. Google AdSense & Third-Party Ads</h2>
                    <p>
                        If Google AdSense is enabled, Google may use cookies to serve ads based on past visits to this Site and other
                        sites. To use AdSense, we include Google scripts which are governed by Google{"'"}s privacy policy. You can opt
                        out of personalized ads via Google Ad Settings.
                    </p>

                </section>

                <section>
                    <h2>5. Data Security</h2>
                    <p>
                        We take reasonable measures to protect data. However, no method of transmission over the internet is 100%
                        secure — we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2>6. Retention</h2>
                    <p>Contact form data is retained only as long as necessary to respond or as required by law (default: 24 months).</p>
                </section>

                <section>
                    <h2>7. Your Rights</h2>
                    <p>
                        You can request access, correction, or deletion of personal data collected via the Site by contacting us at
                        <a href={`mailto:${appConfig.emails[0]}`}>{appConfig.emails[0]}</a>. We will respond per applicable law.
                    </p>
                </section>

                <section>
                    <h2>8. International Transfers</h2>
                    <p>
                        Data may be stored or processed in countries other than your own. By using this Site you consent to such
                        transfers.
                    </p>
                </section>

                <section>
                    <h2>9. Changes</h2>
                    <p>
                        We may update this Policy. We will post the updated Policy on this page with a revised effective date.
                    </p>
                </section>

                <section>
                    <h2>10. Contact</h2>
                    <p>For questions: <a href={`mailto:${appConfig.emails[0]}`}>{appConfig.emails[0]}</a>
                    </p>

                    <hr />
                    <p className="text-sm">Effective date: {new Date().toLocaleDateString()}</p>
                </section>
            </article>
        </main>
    );
};

export default PrivacyPolicyPage;

