import React from "react";
import { useTranslation } from "react-i18next";

function Terms() {
  const { t } = useTranslation();

  return (
    <div className="terms-container">
      <h1>{t("termsAndConditionsTitle")}</h1>
      <section>
        <h2>{t("introductionTitle")}</h2>
        <p>{t("introductionContent")}</p>
      </section>
      <section>
        <h2>{t("registrationAndAccountTitle")}</h2>
        <ul>
          <li>{t("registrationAndAccountContent1")}</li>
          <li>{t("registrationAndAccountContent2")}</li>
        </ul>
      </section>
      <section>
        <h2>{t("contentPublishingRulesTitle")}</h2>
        <ul>
          <li>{t("contentPublishingRulesContent1")}</li>
          <li>{t("contentPublishingRulesContent2")}</li>
          <li>{t("contentPublishingRulesContent3")}</li>
        </ul>
      </section>
      <section>
        <h2>{t("privacyTitle")}</h2>
        <p>{t("privacyContent")}</p>
      </section>
      <section>
        <h2>{t("liabilityLimitationTitle")}</h2>
        <ul>
          <li>{t("liabilityLimitationContent1")}</li>
          <li>{t("liabilityLimitationContent2")}</li>
        </ul>
      </section>
      <section>
        <h2>{t("termsChangesTitle")}</h2>
        <ul>
          <li>{t("termsChangesContent1")}</li>
          <li>{t("termsChangesContent2")}</li>
        </ul>
      </section>
      <section>
        <h2>{t("contactTitle")}</h2>
        <p>{t("contactContent")}</p>
      </section>
    </div>
  );
}

export default Terms;
