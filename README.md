
# GenomicsXAI: High-Fidelity Interactive Dashboard for Explainable Genomics

GenomicsXAI is a high-fidelity HCI (Human-Computer Interaction) prototype designed to bridge the gap between complex single-cell transcriptomic data and human-centric discovery. Developed as a research-grade interface, it prioritizes Explainable AI (XAI), providing researchers with transparent, evidence-based insights into automated genomic pipelines.

## 🧬 Project Overview

In modern bioinformatics, AI models often act as "black boxes." GenomicsXAI addresses this by integrating interpretability frameworks directly into the user experience. The dashboard allows researchers to not only see the classification of cells but also understand the biological and computational reasoning behind every prediction.

## 🚀 Key Features

1. **Explainable Marker Gene Identification**

SHAP-Based Attribution: Visualizes feature importance using SHAP (SHapley Additive exPlanations) to rank genes driving cluster classification.
Interactive Pathway Mapping: A dynamic network topology mapping marker genes to canonical biological pathways (KEGG/Reactome).
Guided Visualization: High-fidelity UMAP (Uniform Manifold Approximation and Projection) scatter plots for exploring cellular landscapes in 2D space.

2. **Automated Cell Type Annotation**

ScanVI Integration: Leverages Variational Inference models to predict cell identities with high confidence.
Evidence Panels: Dual-view reasoning that separates "Biological Evidence" (marker-based) from "Model Inference" (latent space mapping).

3. **Cell Status & Health Diagnostics**

Solo Doublet Detection: Deep learning-based identification of cellular artifacts and doublets.
Viability Metrics: Real-time monitoring of mitochondrial content and stress-response signatures.

4. **AI Research Assistant**

Conversational Intelligence: Powered by the Gemini API, the "Ask AI" module assists researchers in interpreting results, summarizing pathways, and troubleshooting pipelines using natural language.

## 🛠️ Tech Stack

**Framework:** React 19 (ES6+ Modules)

**Styling:** Tailwind CSS (Utility-first high-fidelity design)

**Icons:** Lucide-React

**AI Engine:** Google Gemini API (@google/genai)

**HCI Patterns:** Glassmorphism, Responsive Grid Layouts, and Motion-driven Transitions.


## 🧪 Scientific Methodology

The prototype simulates a pipeline following these industry-standard algorithms:

Dimensionality Reduction: UMAP

Annotation: ScanVI (Variational Inference)

XAI: SHAP (Game Theory based attribution)

QC: Solo (Doublet detection via Synthetic Doublet training)

## 📂 Repository Structure

```text
├── views/
│   ├── LandingPage.tsx               # Entry point with XAI concept overview
│   ├── DashboardHome.tsx             # Experiment management & file upload
│   ├── MarkerGeneIdentification.tsx  # XAI, Pathway Maps, and UMAP
│   ├── CellTypeAnnotation.tsx        # Automated labeling & model reasoning
│   └── CellStatus.tsx                # Health diagnostics & QC metrics
├── components/
│   └── DashboardLayout.tsx           # Persistent navigation and system shell
├── types.ts                          # Shared TypeScript interfaces
└── App.tsx                           # View orchestration and state management
```

## 🤝 Contributors

**Md Shahin**
**B H Hridoy**
**Rashedul Islam**
**Junayaid Islam**
**Tareq Monour**
**Parvez Hasan**

## 📈 Future Roadmap

Spatial Transcriptomics: Integration of tissue-mapping visuals.
Multi-Omic Support: Expansion into Proteomics and Epigenomics.
In-Silico Perturbation: A "What-If" engine to virtually knock out genes and predict phenotype shifts.

## 📄 License

This project is open-source and available under the **MIT License**.

**This project is developed as a high-fidelity HCI prototype for research and educational purposes.**

## 🔗 Live Demo

[View Live Site 🌍](https://xaiapplication.vercel.app/)

