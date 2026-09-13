const platforms = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Monster",
  "ZipRecruiter",
];

function PlatformStrip() {
  return (
    <section className="platform-section">

      <div className="container">

        <p className="platform-title">
          WORKS WITH ALL MAJOR PLATFORMS
        </p>

        <div className="platforms">

          {[...platforms, ...platforms].map(
            (platform, index) => (
              <span
                key={`${platform}-${index}`}
                className="platform"
              >
                {platform}
              </span>
            )
          )}

        </div>

      </div>

    </section>
  );
}

export default PlatformStrip;