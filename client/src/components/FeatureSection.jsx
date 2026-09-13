const features = [
  {
    icon: "🧠",
    title: "Semantic Analysis",
    description:
      "Our AI understands context, not just keywords. Make sure your experience communicates your real value.",
    color: "blue",
  },
  {
    icon: "🛡",
    title: "ATS Ready",
    description:
      "Prepare your resume for applicant tracking systems and identify formatting or parsing problems.",
    color: "green",
  },
  {
    icon: "🗺",
    title: "Learning Roadmaps",
    description:
      "Discover missing skills and build a practical roadmap to bridge the gap between your resume and your dream role.",
    color: "purple",
  },
];

function FeatureSection() {
  return (
    <section id="features" className="features-section">

      <div className="container">

        <div className="section-heading">

          <h2>
            Everything you need to get hired
          </h2>

          <p>
            Stop guessing what recruiters want.
            ResumeSync gives you the intelligence
            to stand out.
          </p>

        </div>

        <div className="feature-grid">

          {features.map((feature) => (
            <div
              className="feature-card"
              key={feature.title}
            >

              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default FeatureSection;