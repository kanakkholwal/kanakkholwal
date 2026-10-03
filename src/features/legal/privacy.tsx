import { appConfig } from "root/project.config";
import { LegalPage } from "./layout";

const email = appConfig.emails[0];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="privacy." description="What this site collects, why, and how to ask for it to be removed.">
      <p>
        This policy explains how <strong>{appConfig.displayName}'s portfolio</strong> ("we", "us") collects, uses and
        shares information through this website (the "Site"). By using the Site you agree to the terms below.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Automatically collected:</strong> anonymized analytics (page views, referrers, device info).
        </li>
        <li>
          <strong>Cookies and similar:</strong> session cookies and persistent cookies used for analytics and ads.
        </li>
        <li>
          <strong>User provided:</strong> messages you send by email (name, email, message), kept only to reply.
        </li>
        <li>
          <strong>Third party:</strong> data collected by third party services on the Site (Google Analytics, Google
          AdSense).
        </li>
      </ul>

      <h2>2. How we use data</h2>
      <ul>
        <li>Operate and maintain the Site.</li>
        <li>Improve performance and experience through anonymized analytics.</li>
        <li>Deliver advertisements through Google AdSense (if enabled), see section 4.</li>
        <li>Respond to contact requests.</li>
      </ul>

      <h2>3. Cookies and tracking</h2>
      <p>
        We use cookies and similar technologies. You can disable cookies in your browser, but some features may not work
        correctly. Third party services used on the Site may also set cookies (for example, Google services).
      </p>

      <h2>4. Google AdSense and third party ads</h2>
      <p>
        If Google AdSense is enabled, Google may use cookies to serve ads based on past visits to this Site and other
        sites. Those scripts are governed by Google's privacy policy. You can opt out of personalized ads in Google Ad
        Settings.
      </p>

      <h2>5. Data security</h2>
      <p>
        We take reasonable measures to protect data. No method of transmission over the internet is fully secure, so we
        cannot guarantee absolute security.
      </p>

      <h2>6. Retention</h2>
      <p>Contact messages are kept only as long as needed to respond, or as required by law (default: 24 months).</p>

      <h2>7. Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of personal data collected through the Site by writing to{" "}
        <a href={`mailto:${email}`}>{email}</a>. We will respond as applicable law requires.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Data may be stored or processed in countries other than your own. By using the Site you consent to such
        transfers.
      </p>

      <h2>9. Changes</h2>
      <p>We may update this policy. The updated policy will be posted on this page with a new date.</p>

      <h2>10. Contact</h2>
      <p>
        Questions: <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
