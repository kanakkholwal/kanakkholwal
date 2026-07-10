export const educationExperiences = [
  {
    school: "National Institute of Technology, Hamirpur",
    href: "https://nith.ac.in",
    degree: "Integrated Dual Degree (B.Tech. + M.Tech.), ECE",
    logoUrl:
      "https://2hy7y2bvb4.ufs.sh/f/zWIvIoJSZF4Q1sGyUyITPZD6mAdTXjKkufM30qH2OYSCoLJI",
    start: "2021",
    end: "2026",
    badges: ["Deep Learning", "Signal Processing"],
    description: `**M.Tech. thesis: Myocardial infarction detection from ECG and PPG signals.**

Independent research (submitted as journal work, not accepted for publication). I took two deliberate departures from the mainstream approach in the literature:

- **Patient-wise splitting instead of segment-wise.** Most existing papers split the data segment-wise, which leaks a single patient's records across the train, validation, and test sets. The model then partly memorizes patients rather than learning the condition, which inflates reported accuracy. I split strictly by patient so no patient appeared in more than one set, a harder and more honest evaluation.
- **A much larger dataset.** Most prior work trained on small sets capped around 2,000 records. I used the largest open-source dataset I could source and scaled training to roughly 15,000 records.

The model ran three pipelines in parallel: a plain CNN, a ResNet, and an Inception network with an XGBoost classifier. A decision-tree ensemble made the final binary call, weighting each pipeline's vote by how well it performed on its own validation and test results, so stronger pipelines counted more toward the final prediction.`,
  },
];
