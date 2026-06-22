export interface DNANode {
  id: string;
  label: string;
  role: string;
  description: string;
  x: number; // Coordinate within a 0-500 SVG canvas width
  y: number; // Coordinate within a 0-240 SVG canvas height
}

export interface DNAConnection {
  from: string;
  to: string;
  label: string;
}

export interface ProjectDNA {
  summary: string;
  nodes: DNANode[];
  connections: DNAConnection[];
}

export const REPO_DNA_MAP: Record<string, ProjectDNA> = {
  'Pact': {
    summary: 'Decentralized contract-state consensus manager. Orchestrates cryptographic transactions via a verified coordinator to ensure distributed ledger state integrity.',
    nodes: [
      { id: 'client', label: 'Client Node', role: 'Transaction Proposer', description: 'Generates and signs cryptographic transaction proposals, submitting them to the consensus pool.', x: 70, y: 120 },
      { id: 'coordinator', label: 'Consensus Coordinator', role: 'Agreement Engine', description: 'Aggregates proposals, verifies signatures, and runs consensus sorting to prevent double-spending.', x: 250, y: 50 },
      { id: 'security', label: 'Contract Manager', role: 'State Validator', description: 'Executes smart contracts in a secure sandbox, validating state transition preconditions.', x: 250, y: 190 },
      { id: 'ledger', label: 'Ledger Store', role: 'Persistent State', description: 'Appends cryptographically chained transaction blocks to the permanent state ledger database.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'client', to: 'coordinator', label: 'Submit Proposal' },
      { from: 'coordinator', to: 'security', label: 'Execute Logic' },
      { from: 'security', to: 'ledger', label: 'Commit State' },
      { from: 'ledger', to: 'client', label: 'Acknowledge' },
    ],
  },
  'Automation-Scripts': {
    summary: 'DevOps automation suite. Hooks trigger actions, running pipelines to compile, containerize, and back up services.',
    nodes: [
      { id: 'cron', label: 'Scheduler', role: 'Trigger Source', description: 'Runs cron schedules and listens to webhook triggers to launch job runner scripts.', x: 80, y: 120 },
      { id: 'pipelines', label: 'CI/CD Engine', role: 'Job Executer', description: 'Runs script suites to compile, run tests, and stage files for production environments.', x: 250, y: 120 },
      { id: 'docker', label: 'Staging Environment', role: 'Container Host', description: 'Builds, tags, and deploys isolated Docker containers containing the updated applications.', x: 420, y: 60 },
      { id: 'backup', label: 'S3 Archiver', role: 'Data Protection', description: 'Compresses system files and dumps databases to securely upload backups to AWS cloud storage.', x: 420, y: 180 },
    ],
    connections: [
      { from: 'cron', to: 'pipelines', label: 'Trigger Job' },
      { from: 'pipelines', to: 'docker', label: 'Stage App' },
      { from: 'pipelines', to: 'backup', label: 'Archive Snapshot' },
    ],
  },
  'MatlabExtension': {
    summary: 'VS Code MATLAB extension. Bridges cursor inputs to compiler diagnostics and plots simulation models.',
    nodes: [
      { id: 'vscode', label: 'VS Code client', role: 'User Interface', description: 'Captures editor typing events, cursor selections, and custom extension commands.', x: 70, y: 120 },
      { id: 'language-server', label: 'Language Server', role: 'Protocol Broker', description: 'Routes editor requests using LSP to auto-complete inputs and identify code outline items.', x: 250, y: 120 },
      { id: 'diagnostics', label: 'MATLAB Compiler', role: 'Syntax Diagnostics', description: 'Compiles expressions in the background to return syntax errors and compiler warnings.', x: 250, y: 45 },
      { id: 'charts', label: 'Plotting Engine', role: 'Visual Simulator', description: 'Parses script variables to output interactive real-time simulation plots inside VS Code panels.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'vscode', to: 'language-server', label: 'LSP Message' },
      { from: 'language-server', to: 'diagnostics', label: 'Compile AST' },
      { from: 'language-server', to: 'charts', label: 'Request Plot' },
      { from: 'charts', to: 'vscode', label: 'Render View' },
    ],
  },
  'non-ideal-reactor-engine': {
    summary: 'Numerical reactor kinetics engine. Computes thermodynamic models and outputs concentration coordinates.',
    nodes: [
      { id: 'input', label: 'Parameters feed', role: 'Initial Values', description: 'Takes initial flow rates, chamber sizes, and chemical species concentration metrics.', x: 70, y: 120 },
      { id: 'solver', label: 'PDE solver', role: 'Numerical Engine', description: 'Solves non-ideal transport equations using differential grid solvers (Runge-Kutta/Euler).', x: 250, y: 120 },
      { id: 'thermo', label: 'Thermo Database', role: 'Property Library', description: 'Retrieves enthalpy variables, thermal thresholds, and kinetics reaction coefficients.', x: 250, y: 45 },
      { id: 'exporter', label: 'Spatial Grid', role: 'Data Visualizer', description: 'Maps output states to matrices, exporting spatial heat and concentration grid values.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'input', to: 'solver', label: 'Load Config' },
      { from: 'solver', to: 'thermo', label: 'Fetch Rates' },
      { from: 'thermo', to: 'solver', label: 'Yield Constants' },
      { from: 'solver', to: 'exporter', label: 'Write Grid' },
    ],
  },
  'Personal-Website': {
    summary: 'Interactive developer portfolio. Serves client requests, fetches live API data, and securely processes emails.',
    nodes: [
      { id: 'browser', label: 'Portfolio UI', role: 'Client Browser', description: 'Renders pages, handles dynamic theme transitions, clock ticks, and search palettes.', x: 70, y: 120 },
      { id: 'proxy', label: 'API Router', role: 'Server API Gateway', description: 'Processes backend routing, aggregates repository cache data, and handles CORS protocols.', x: 250, y: 120 },
      { id: 'github-api', label: 'GitHub API', role: 'External Telemetry', description: 'Yields user metrics, languages, repository updates, and active repository lists.', x: 430, y: 120 },
      { id: 'honey-pot', label: 'Honeypot Filter', role: 'Spam Prevention', description: 'Validates contact form submissions to block malicious scripts and automated web crawlers.', x: 250, y: 50 },
    ],
    connections: [
      { from: 'browser', to: 'proxy', label: 'Get Telemetry' },
      { from: 'proxy', to: 'github-api', label: 'Fetch Profile' },
      { from: 'browser', to: 'honey-pot', label: 'Submit Message' },
    ],
  },
  'CheMate': {
    summary: 'Stoichiometric compound balancer. Queries molecular structures, resolves formulas, and optimizes product yield.',
    nodes: [
      { id: 'interface', label: 'React UI', role: 'Client Inputs', description: 'Allows users to enter reactants and products to calculate required formulation amounts.', x: 80, y: 120 },
      { id: 'database', label: 'Molecular Store', role: 'Formula Dictionary', description: 'Stores element tables, molar weights, and molecular properties for chemical names.', x: 250, y: 50 },
      { id: 'balancer', label: 'Matrix Balancer', role: 'Algebraic Balancer', description: 'Models reaction balancing as systems of linear equations, solving them with Gaussian elimination.', x: 250, y: 190 },
      { id: 'calculator', label: 'Yield Optimizer', role: 'Yield Calculator', description: 'Calculates limiting reactants, theoretical product weights, and yields based on purity ratios.', x: 420, y: 120 },
    ],
    connections: [
      { from: 'interface', to: 'database', label: 'Query Weights' },
      { from: 'database', to: 'balancer', label: 'Balance Formulas' },
      { from: 'balancer', to: 'calculator', label: 'Compute Ratios' },
      { from: 'calculator', to: 'interface', label: 'Render Ratios' },
    ],
  },
  'ClassChronicle': {
    summary: 'Academic schedule allocation coordinator. Maps student courses to classroom times with conflict resolution.',
    nodes: [
      { id: 'enrollments', label: 'Enrollment Deck', role: 'Student Intake', description: 'Registers course choices, verifying pre-requisites and course availability.', x: 70, y: 120 },
      { id: 'scheduler', label: 'Time Engine', role: 'Schedule Manager', description: 'Assigns time windows for classes, resolving room conflicts and student timetables.', x: 250, y: 50 },
      { id: 'allocator', label: 'Resource Map', role: 'Resource Mapper', description: 'Links classrooms, laboratory equipment, and teacher schedules to time blocks.', x: 250, y: 190 },
      { id: 'db', label: 'Data Schema', role: 'Persistent SQLite', description: 'Saves academic schedules, student logins, enrollments, and teacher profiles.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'enrollments', to: 'scheduler', label: 'Enlist Class' },
      { from: 'scheduler', to: 'allocator', label: 'Check Conflict' },
      { from: 'allocator', to: 'db', label: 'Save Timetable' },
      { from: 'db', to: 'enrollments', label: 'Show Schedule' },
    ],
  },
  'Noesis': {
    summary: 'Semantic text classification hub. Tokenizes raw inputs, creates vector embeddings, and indices vector values.',
    nodes: [
      { id: 'parser', label: 'Text Parser', role: 'String Tokenizer', description: 'Pre-processes raw text data, removing markup symbols and extracting tokens.', x: 70, y: 120 },
      { id: 'embedder', label: 'Vector Embedder', role: 'Transformer Engine', description: 'Encodes text tokens into vector coordinates representing semantic similarity contexts.', x: 250, y: 50 },
      { id: 'classifier', label: 'ML Classifier', role: 'Categorizer', description: 'Runs vector classifications to predict text categories and sentiment scores.', x: 250, y: 190 },
      { id: 'search-engine', label: 'Vector Store', role: 'Similarity Search', description: 'Loads vector coordinates into memory to run cosine similarity queries.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'parser', to: 'embedder', label: 'Send Tokens' },
      { from: 'embedder', to: 'classifier', label: 'Infer Label' },
      { from: 'embedder', to: 'search-engine', label: 'Index Coordinate' },
      { from: 'search-engine', to: 'parser', label: 'Fetch Neighbors' },
    ],
  },
  'CHEESA-ChatBot': {
    summary: 'Curriculum syllabus search chatbot. Routes user prompt text, queries index logs, and returns LLM answers.',
    nodes: [
      { id: 'chat-ui', label: 'Chat UI', role: 'User Dialogue', description: 'Provides a text message bubble stream interface for student queries.', x: 70, y: 120 },
      { id: 'intent', label: 'Intent Parser', role: 'Query Classifier', description: 'Determines whether a message is an administrative query, course question, or syllabus check.', x: 250, y: 50 },
      { id: 'curriculum', label: 'Syllabus DB', role: 'Vector Search Context', description: 'Stores course syllabi, lecture objectives, and reference materials for prompt enrichment.', x: 430, y: 120 },
      { id: 'llm', label: 'LLM Runtime', role: 'Response Generator', description: 'Combines curriculum context with prompts to generate response paragraphs.', x: 250, y: 190 },
    ],
    connections: [
      { from: 'chat-ui', to: 'intent', label: 'Post Message' },
      { from: 'intent', to: 'curriculum', label: 'Query Context' },
      { from: 'curriculum', to: 'llm', label: 'Inject Context' },
      { from: 'llm', to: 'chat-ui', label: 'Deliver Answer' },
    ],
  },
  'Songsify': {
    summary: 'Live audio visualizer client. Tracks audio spectrums, plots waveform variables, and targets play endpoints.',
    nodes: [
      { id: 'spotify', label: 'Spotify API', role: 'Playback Stream', description: 'Retrieves active playback status, album art, track details, and streams audio.', x: 70, y: 120 },
      { id: 'analytics', label: 'Audio Analyzer', role: 'Spectrum Processor', description: 'Extracts temporal features (BPM, danceability) and processes active frequency ranges.', x: 250, y: 50 },
      { id: 'visualizer', label: 'Canvas Visualizer', role: 'Waveform Renderer', description: 'Draws responsive circular waveforms and audio bars using standard web canvas layers.', x: 250, y: 190 },
      { id: 'controller', label: 'Playback Control', role: 'Command Dispatch', description: 'Dispatches play, skip, and volume control actions back to Spotify player API.', x: 430, y: 120 },
    ],
    connections: [
      { from: 'spotify', to: 'analytics', label: 'Audio Streams' },
      { from: 'analytics', to: 'visualizer', label: 'Render FFT Data' },
      { from: 'controller', to: 'spotify', label: 'Trigger Commands' },
      { from: 'visualizer', to: 'controller', label: 'Sync Frames' },
    ],
  },
  'PacketHound': {
    summary: 'TCP/IP network frame inspector. Sniffs active network buffers, decodes headers, and plots packet metrics.',
    nodes: [
      { id: 'socket', label: 'Raw Socket Sniffer', role: 'Frame Capture', description: 'Captures low-level network adapter frames in real-time, operating in promiscuous mode.', x: 70, y: 120 },
      { id: 'decoder', label: 'Frame Decoder', role: 'Packet Decoder', description: 'Extracts Ethernet, IP, TCP/UDP headers and decodes raw hex data payloads.', x: 250, y: 50 },
      { id: 'telemetry', label: 'Metrics Engine', role: 'Throughput Analytics', description: 'Calculates active network metrics: bandwidth usage, protocol share, and connection logs.', x: 430, y: 120 },
      { id: 'visualizer', label: 'Console Dashboard', role: 'UI Monitor', description: 'Renders color-coded frame summaries, packet lists, and throughput charts.', x: 250, y: 190 },
    ],
    connections: [
      { from: 'socket', to: 'decoder', label: 'Sniff Frames' },
      { from: 'decoder', to: 'telemetry', label: 'Tally Protocol' },
      { from: 'telemetry', to: 'visualizer', label: 'Update dashboard' },
      { from: 'decoder', to: 'visualizer', label: 'Post details' },
    ],
  },
  'Rinne': {
    summary: 'Custom memory allocator kernel library. Maps alignment offsets, checks metrics, and runs algorithms.',
    nodes: [
      { id: 'allocator', label: 'Memory Allocator', role: 'Aligned Pool Manager', description: 'Manages custom aligned heap segments, reducing overhead fragmentation.', x: 70, y: 120 },
      { id: 'diagnostics', label: 'Hardware Hooks', role: 'Telemetry Reader', description: 'Reads processor register records and system statistics directly.', x: 250, y: 50 },
      { id: 'algorithms', label: 'Core Algorithms', role: 'Algorithmic Helpers', description: 'Provides fast search arrays, sort vectors, and memory block operations.', x: 430, y: 120 },
      { id: 'kernel-api', label: 'Syscall Router', role: 'Kernel boundary', description: 'Interfaces client processes with protected memory blocks and diagnostics.', x: 250, y: 190 },
    ],
    connections: [
      { from: 'kernel-api', to: 'allocator', label: 'Allocate heap' },
      { from: 'allocator', to: 'diagnostics', label: 'Log address' },
      { from: 'algorithms', to: 'allocator', label: 'Request buffers' },
      { from: 'kernel-api', to: 'algorithms', label: 'Invoke utility' },
    ],
  },
};

// Generates dynamic 3-node architecture based on primary repository language
export function getProjectDNA(name: string, primaryLanguage: string | null): ProjectDNA {
  if (REPO_DNA_MAP[name]) {
    return REPO_DNA_MAP[name];
  }

  const lang = primaryLanguage || 'Code';

  return {
    summary: `Dynamic architecture DNA computed for repository: ${name}. Showcases custom codebase flow based on ${lang} frameworks.`,
    nodes: [
      { id: 'ui', label: 'Client / Interface', role: 'User Actions', description: 'Captures clicks and queries, rendering the application state and responses.', x: 80, y: 120 },
      { id: 'controller', label: 'Application Logic', role: 'Router & Controller', description: `Processes operations, manages business logic, and coordinates data updates written in ${lang}.`, x: 250, y: 120 },
      { id: 'storage', label: 'Persistence / DB', role: 'State Store', description: 'Saves project configurations, user data, state settings, and session caches.', x: 420, y: 120 },
    ],
    connections: [
      { from: 'ui', to: 'controller', label: 'Dispatch Query' },
      { from: 'controller', to: 'storage', label: 'Update DB' },
      { from: 'storage', to: 'ui', label: 'Notify Change' },
    ],
  };
}
