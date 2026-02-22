import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

export const metadata = generateMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for Your Name — portfolio site. Rules for using this website.",
  path: "/legal/terms",
  keywords: ["terms and conditions", "portfolio terms", "legal"],
});

const PrivacyPolicyPage: React.FC = () => {
  return (
    <main title="Privacy Policy" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Terms</h1>
      <article className="prose prose-lg dark:prose-invert">
        <section>
          <p>
            Welcome to{" "}
            <strong>
              {appConfig.displayName}
              {"'"}s Portfolio
            </strong>{" "}
            ({`"Site"`}). By accessing or using the Site you agree to these
            Terms. If you disagree, do not use the Site.
          </p>
        </section>

        <section>
          <h2>1. Use of Site</h2>
          <p>
            The Site is a personal portfolio and blog. You may view, share, and
            download content for personal, non-commercial use unless specific
            content is licensed otherwise.
          </p>
        </section>

        <section>
          <h2>2. Intellectual Property</h2>
          <p>
            All content (text, images, code samples) on the Site is owned by or
            licensed to the Site owner. You may not republish or redistribute
            content without permission. Code snippets are generally provided
            under MIT unless otherwise noted — verify license notes near each
            snippet.
          </p>
        </section>
        <section>
          <p>
            This Privacy Policy explains how{" "}
            <strong>
              {appConfig.displayName}
              {"'"}s Portfolio
            </strong>{" "}
            ({`"we", "us"`}) collects, uses, and shares information through this
            portfolio website ({`"Site"`}). By using the Site you agree to the
            terms below.
          </p>
        </section>

        <section>
          <p>
            All content (text, images, code samples) on the Site is owned by or
            licensed to the Site owner. You may not republish or redistribute
            content without permission. Code snippets are generally provided
            under MIT unless otherwise noted — verify license notes near each
            snippet.
          </p>
        </section>

        <section>
          <h2>3. External Links</h2>
          <p>
            The Site may link to external websites. Links are provided for
            convenience; we are not responsible for their content and linking
            does not imply endorsement.
          </p>
        </section>

        <section>
          <h2>4. Disclaimers</h2>
          <p>
            Content is provided {`"as is"`} without warranties. We are not
            liable for damages arising from use of the Site.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            To the fullest extent allowed by law, the Site owner is not liable
            for direct, indirect, incidental, or consequential damages related
            to use of the Site.
          </p>
        </section>

        <section>
          <h2>6. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the country where the Site
            owner is resident. If you are unsure, contact{" "}
            <a href={`mailto:${appConfig.emails[0]}`}>{appConfig.emails[0]}</a>{" "}
            for clarification.
          </p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>
            We may modify these Terms. Continued use after changes constitutes
            acceptance. Check this page for updates.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            For questions:{" "}
            <a href={`mailto:${appConfig.emails[0]}`}>{appConfig.emails[0]}</a>
          </p>

          <hr />
          <p className="text-sm">
            Effective date: {new Date().toLocaleDateString()}
          </p>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
