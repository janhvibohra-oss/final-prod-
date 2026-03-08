import { useState } from "react";
import { ROADMAP_STEPS, DOCUMENTS, FUNDING_PROGRAMS } from "../constants/data";
import GrantModal from "../components/modals/GrantModal";
import DocModal from "../components/modals/DocModal";

export default function Dashboard({ onGetStarted }) {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [completedSteps, setCompletedSteps] = useState([0, 1]); // Mock progress
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const tabs = [
    { id: 'roadmap', label: '🗺️ Roadmap' },
    { id: 'vault', label: '📁 Document Vault' },
    { id: 'funding', label: '💰 Funding' },
    { id: 'compliance', label: '🔔 Compliance' },
  ];

  // Mock compliance data for the dashboard
  const complianceItems = [
    { title: "GST/HST Registration", due: "Mar 25, 2026", days: 18, color: "orange" },
    { title: "AGCO Liquor Licence Renewal", due: "Mar 12, 2026", days: 5, color: "red" },
  ];

  const toggleStepDone = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="dashboard-container">
      {/* 1. Header with Stats */}
      <header className="dash-header">
        <div>
          <h1>Welcome back, <span className="grad-text">Amir</span> 👋</h1>
          <div className="dash-badges">
            <span className="badge-blue">Pita Palace Inc.</span>
            <span className="badge-gray">Ontario · Food & Beverage</span>
          </div>
        </div>
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-val">$47,500</div>
            <div className="stat-lab">GRANTS AVAILABLE</div>
          </div>
        </div>
      </header>

      {/* 2. Urgent Alert */}
      <div className="dash-alert animate-fade-in">
        <span>🚨</span>
        <p>
          <strong>Liquor Licence Renewal</strong> due in 5 days —{" "}
          <button
            className="btn-link"
            onClick={() => setActiveTab('compliance')}
          >
            Act Now
          </button>
        </p>
      </div>

      {/* 3. Tab Navigation */}
      <nav className="dash-tabs">
        {tabs.map(t => (
          <button 
            key={t.id} 
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* 4. Tab Content Logic */}
      <div className="tab-content">
        {activeTab === 'roadmap' && (
          <div className="roadmap-list card-white">
            <div className="list-header">
              <h3>My Business Roadmap</h3>
              <span>{completedSteps.length} of {ROADMAP_STEPS.length} complete</span>
            </div>
            <div className="roadmap-grid">
            {ROADMAP_STEPS.map((step, i) => (
              <div key={i} className="dash-row">
                <div className={`status-dot ${completedSteps.includes(i) ? 'done' : 'todo'}`} />
                <div className="row-info">
                  <div className={`row-title ${completedSteps.includes(i) ? 'strike' : ''}`}>{step.title}</div>
                  <div className="row-meta">{step.level} · {step.cost}</div>
                </div>
                <button
                  className="btn-primary-xs"
                  onClick={() => toggleStepDone(i)}
                >
                  {completedSteps.includes(i) ? 'Undo' : 'Mark Done'}
                </button>
              </div>
            ))}
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="vault-grid">
            {DOCUMENTS.map((doc, i) => (
              <button
                key={i}
                type="button"
                className="doc-card"
                onClick={() => setSelectedDoc(doc)}
              >
                <span className="doc-icon">{doc.icon}</span>
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className={`doc-status ${doc.status}`}>{doc.status}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'funding' && (
          <div className="funding-list card-white">
            <div className="list-header">
              <h3>Matched Funding Programs</h3>
              <span>{FUNDING_PROGRAMS.length} programs</span>
            </div>
            <div className="roadmap-grid">
              {FUNDING_PROGRAMS.map((grant, i) => (
                <div key={i} className="dash-row">
                  <div className="row-info">
                    <div className="row-title">{grant.name}</div>
                    <div className="row-meta">
                      {grant.type} · {grant.amount} · {grant.deadline}
                    </div>
                  </div>
                  <button
                    className="btn-primary-xs"
                    type="button"
                    onClick={() => setSelectedGrant(grant)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="roadmap-list card-white">
            <div className="list-header">
              <h3>Compliance Tracker</h3>
              <span>{complianceItems.length} upcoming items</span>
            </div>
            <div className="roadmap-grid">
              {complianceItems.map((item, i) => (
                <div key={i} className="dash-row">
                  <div className={`status-dot ${item.color}`} />
                  <div className="row-info">
                    <div className="row-title">{item.title}</div>
                    <div className="row-meta">
                      Due {item.due} · {item.days} days
                    </div>
                  </div>
                  <button
                    className="btn-primary-xs"
                    type="button"
                    onClick={() => setActiveTab('vault')}
                  >
                    View Documents
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals fed by the dashboard buttons */}
      <GrantModal
        grant={selectedGrant}
        onClose={() => setSelectedGrant(null)}
      />
      <DocModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}
