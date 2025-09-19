import React, { useState } from "react";
import ProductForm from "./ProductForm";
import "../assets/accordion.css";

const Accordion = ({
  forms,
  units,
  backgrounds,
  onFormChange,
  onUnitChange,
  onBackgroundChange,
  onDownload,
  onAddToQueue,
  errors,
  is4Paneles,
  onSingleChange,
  onSingleUnitChange
}) => {
  const [expandedPanel, setExpandedPanel] = useState(0); // Primer panel abierto por defecto

  const togglePanel = (index) => {
    setExpandedPanel(expandedPanel === index ? null : index);
  };

  if (!is4Paneles) {
    return (
      <ProductForm
        values={forms[0] || {}}
        units={units}
        backgrounds={backgrounds}
        onChange={onSingleChange || ((e) => onFormChange(0, e))}
        onUnitChange={onSingleUnitChange || ((e) => onUnitChange(0, e))}
        onBackgroundChange={onBackgroundChange}
        onDownload={onDownload}
        onAddToQueue={onAddToQueue}
        errors={errors[0] || {}}
      />
    );
  }

  return (
    <div className="accordion" role="tablist" aria-multiselectable="true">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="accordion-panel">
          <button
            className="accordion-header"
            onClick={() => togglePanel(index)}
            aria-expanded={expandedPanel === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            role="tab"
          >
            <span className="panel-title">Panel {index + 1}</span>
            <span className="accordion-icon">
              {expandedPanel === index ? "−" : "+"}
            </span>
          </button>
          <div
            className={`accordion-content ${expandedPanel === index ? "expanded" : ""}`}
            id={`panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            aria-hidden={expandedPanel !== index}
          >
            <ProductForm
              values={forms[index] || {}}
              units={units}
              backgrounds={backgrounds}
              onChange={(e) => onFormChange(index, e)}
              onUnitChange={(e) => onUnitChange(index, e)}
              onBackgroundChange={onBackgroundChange}
              onDownload={onDownload}
              onAddToQueue={onAddToQueue}
              errors={errors[index] || {}}
              panelIndex={index}
              hideBackgroundSelector={true}
              hideButtons={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;