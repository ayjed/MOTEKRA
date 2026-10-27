import { Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/motion/typography";
import { ProcessNarrative } from "@/components/home/process-narrative";
import { processSteps } from "@/components/sections/shared";
import "@/styles/process.css";

function ConceptWindow({ small = false }: { small?: boolean }) {
  return (
    <div className={`concept-window ${small ? "small-window" : ""}`} aria-hidden="true">
      <div className="concept-browser">
        <i /><i /><i />
        <span>MOTEKRA / INTERFACE STUDY</span>
      </div>
      <div className="concept-body">
        <aside>
          <b>M.</b>
          <i /><i /><i />
        </aside>
        <div>
          <span className="concept-kicker">DESIGN / BUILD / EXPLORE</span>
          <strong>Ideas become<br />interfaces.</strong>
          <div className="concept-panels"><i /><i /><i /></div>
          <div className="concept-lines"><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

export function WorkProcess() {
  return (
    <section className="section dark work-process" id="work-process" data-work-section="process" aria-labelledby="process-title">
      <div className="container">
        <Eyebrow>The process / a proposed working approach</Eyebrow>
        <div className="section-heading">
          <div id="process-title">
            <SplitHeading lines={["From Idea", "to Impact."]} />
          </div>
          <p>Every step makes the next one clearer.</p>
        </div>
        <ProcessNarrative>
          <div className="process-product" aria-hidden="true">
            <div className="process-product-bar">
              <i /><i /><i />
              <span>THE PRODUCT / TAKING SHAPE</span>
            </div>
            <div className="process-visual-steps">
              <div className="process-pane pane-0">
                <span>DISCOVER</span>
                <strong>Start with<br />the right questions.</strong>
                <div className="discovery-notes">
                  <i>People</i>
                  <i>Problem</i>
                  <i>Possibility</i>
                </div>
              </div>
              <div className="process-pane pane-1">
                <span>DEFINE</span>
                <strong>A clearer<br />direction.</strong>
                <div className="definition-map">
                  <i>Intent</i>
                  <i>Scope</i>
                  <i>Priorities</i>
                </div>
              </div>
              <div className="process-pane pane-2">
                <span>DESIGN</span>
                <strong>Give the idea<br />an interface.</strong>
                <ConceptWindow small />
              </div>
              <div className="process-pane pane-3">
                <span>DEVELOP</span>
                <strong>Make the<br />experience real.</strong>
                <div className="code-study">
                  <i /><i /><i /><i /><i />
                </div>
              </div>
              <div className="process-pane pane-4">
                <span>LAUNCH</span>
                <strong>Ready for<br />production.</strong>
                <div className="launch-dashboard">
                  <div className="launch-status-pill">● Production Status: Active</div>
                  <div className="launch-metrics">
                    <div><span>Build</span><strong>Passed</strong></div>
                    <div><span>Uptime</span><strong>99.98%</strong></div>
                    <div><span>Latency</span><strong>&lt; 14ms</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="process-product-footer">
              DISCOVER <span>→</span> DEFINE <span>→</span> DESIGN <span>→</span> DEVELOP <span>→</span> LAUNCH
            </div>
          </div>
          <div className="process-step-list">
            <div className="process-energy" aria-hidden="true">
              <div className="process-energy-fill" />
            </div>
            <ol>
              {processSteps.map(([title, description]) => (
                <li data-process-step key={title}>
                  <span className="narrative-index" aria-hidden="true">◆</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="step-orb" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </ProcessNarrative>
      </div>
    </section>
  );
}
