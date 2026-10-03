import { appConfig } from "root/project.config";
import { LegalPage } from "./layout";

const email = appConfig.emails[0];

export default function TermsPage() {
  return (
    <LegalPage title="terms." description="The rules for using this site and its content.">
      <p>
        Welcome to <strong>{appConfig.displayName}'s portfolio</strong> (the "Site"). By accessing or using the Site you
        agree to these terms. If you disagree, please do not use the Site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>
        The Site is a personal portfolio and blog. You may view, share and download content for personal, non-commercial
        use unless specific content is licensed otherwise.
      </p>

      <h2>2. Intellectual property</h2>
      <p>
        All content (text, images, code samples) on the Site is owned by or licensed to the Site owner. You may not
        republish or redistribute it without permission. Code snippets are generally MIT licensed unless noted
        otherwise, so check the license note near each snippet.
      </p>

      <h2>3. External links</h2>
      <p>
        The Site links to external websites for convenience. We are not responsible for their content, and a link does
        not imply endorsement.
      </p>

      <h2>4. Disclaimers</h2>
      <p>Content is provided "as is" without warranties. We are not liable for damages arising from use of the Site.</p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the fullest extent allowed by law, the Site owner is not liable for direct, indirect, incidental or
        consequential damages related to use of the Site.
      </p>

      <h2>6. Governing law</h2>
      <p>
        These terms are governed by the laws of the country where the Site owner lives. If you are unsure, write to{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>7. Changes to these terms</h2>
      <p>We may change these terms. Continuing to use the Site after a change means you accept it.</p>

      <h2>8. Contact</h2>
      <p>
        Questions: <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
