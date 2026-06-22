export interface CodeFile {
  name: string;
  language: 'go' | 'python' | 'typescript' | 'rust' | 'cpp' | 'bash' | 'markdown' | 'javascript';
  content: string;
}

export interface CodeTree {
  [path: string]: CodeFile;
}

export const PROJECT_CODE_DATA: Record<string, CodeTree> = {
  Pact: {
    'src/consensus/raft.go': {
      language: 'go',
      name: 'raft.go',
      content: `package consensus

import (
	"sync"
	"time"
)

type State int

const (
	Follower State = iota
	Candidate
	Leader
)

type ConsensusModule struct {
	mu        sync.Mutex
	peers     []string
	nodeId    string
	state     State
	currentTerm int
	votedFor  string
	
	heartbeatTimeout time.Duration
	electionTimeout  time.Duration
}

// StartElection initiates the leader election process
func (cm *ConsensusModule) StartElection() {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	
	cm.state = Candidate
	cm.currentTerm++
	cm.votedFor = cm.nodeId
	
	votesReceived := 1
	for _, peer := range cm.peers {
		go func(p string) {
			if cm.requestVote(p) {
				cm.mu.Lock()
				votesReceived++
				if votesReceived > len(cm.peers)/2 && cm.state == Candidate {
					cm.state = Leader
					cm.startHeartbeats()
				}
				cm.mu.Unlock()
			}
		}(peer)
	}
}

func (cm *ConsensusModule) requestVote(peer string) bool {
	// Simulated cryptographically signed RPC request
	time.Sleep(50 * time.Millisecond)
	return true
}`,
    },
    'src/crypto/proof.go': {
      language: 'go',
      name: 'proof.go',
      content: `package crypto

import (
	"crypto/sha256"
	"math/big"
)

// ZeroKnowledgeProof represents a non-interactive proof of knowledge
type ZeroKnowledgeProof struct {
	C *big.Int // Challenge
	S *big.Int // Response
}

// VerifyTransactionProof validates transaction integrity without revealing balances
func VerifyTransactionProof(pubKey *big.Int, generator *big.Int, zkp *ZeroKnowledgeProof) bool {
	// g^s * y^c = generator^S * pubKey^C
	var gs, yc, lhs big.Int
	gs.Exp(generator, zkp.S, nil)
	yc.Exp(pubKey, zkp.C, nil)
	lhs.Mul(&gs, &yc)

	// Recompute challenge hash
	h := sha256.New()
	h.Write(lhs.Bytes())
	expectedC := new(big.Int).SetBytes(h.Sum(nil))

	return zkp.C.Cmp(expectedC) == 0
}`,
    },
  },
  'non-ideal-reactor-engine': {
    'simulation/solver.py': {
      language: 'python',
      name: 'solver.py',
      content: `import numpy as np

def runge_kutta_4(f, y0, t):
    """
    Solves concentration gradients using 4th-order Runge-Kutta numerical integration.
    """
    n = len(t)
    y = np.zeros((n, len(y0)))
    y[0] = y0
    
    for i in range(n - 1):
        h = t[i+1] - t[i]
        k1 = f(t[i], y[i])
        k2 = f(t[i] + h/2, y[i] + k1*h/2)
        k3 = f(t[i] + h/2, y[i] + k2*h/2)
        k4 = f(t[i] + h, y[i] + k3*h)
        
        y[i+1] = y[i] + (h/6) * (k1 + 2*k2 + 2*k3 + k4)
        
    return y

def reactor_ode(t, y, k=0.15, v_max=1.2, km=0.5):
    # Concentration profiles: [Reactant A, Reactant B, Product C]
    Ca, Cb, Cc = y
    
    # Non-ideal thermodynamic mixing term
    dispersion_coeff = 0.05 * np.sin(t * 0.2)
    
    # Reaction rate using Michaelis-Menten kinetics
    rate = (v_max * Ca) / (km + Ca) + dispersion_coeff
    
    dCa_dt = -rate
    dCb_dt = -rate * 0.8
    dCc_dt = rate
    
    return np.array([dCa_dt, dCb_dt, dCc_dt])`,
    },
    'simulation/thermo.py': {
      language: 'python',
      name: 'thermo.py',
      content: `import math

def arrhenius_rate(A, Ea, T, R=8.314):
    """
    Computes reaction rate constant k based on activation energy and local temperature.
    A: Pre-exponential factor
    Ea: Activation energy (J/mol)
    T: Local temperature (Kelvin)
    """
    if T <= 0:
        raise ValueError("Temperature must be greater than absolute zero.")
        
    # k = A * exp(-Ea / (R * T))
    exponent = -Ea / (R * T)
    k = A * math.exp(exponent)
    return k

def concentration_dispersion(x, velocity, D_axial, L):
    """
    Calculates numerical axial dispersion in a non-ideal Plug Flow Reactor (PFR).
    """
    # Peclet number (Pe) calculation: Pe = u * L / D
    if D_axial == 0:
        return float('inf')
    pe = (velocity * L) / D_axial
    return pe`,
    },
  },
  'Personal-Website': {
    'src/components/ProjectModal.tsx': {
      language: 'typescript',
      name: 'ProjectModal.tsx',
      content: `// Boundary calculations for DNA Connections
const getLineEndpoints = (fromNode: Node, toNode: Node) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  if (len === 0) return { x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y };

  const ux = dx / len;
  const uy = dy / len;

  const rx = 55;
  const ry = 18;

  const rFrom = 1 / Math.sqrt(Math.pow(ux / rx, 2) + Math.pow(uy / ry, 2));
  const rTo = 1 / Math.sqrt(Math.pow(ux / rx, 2) + Math.pow(uy / ry, 2));

  // Offset 0.6 keeps arrow points flush with capsule boundaries
  return {
    x1: fromNode.x + ux * rFrom,
    y1: fromNode.y + uy * rFrom,
    x2: toNode.x - ux * (rTo + 0.6),
    y2: toNode.y - uy * (rTo + 0.6)
  };
};`,
    },
    'src/components/CommandPalette.tsx': {
      language: 'typescript',
      name: 'CommandPalette.tsx',
      content: `// Executing kernel panic simulation sequence
case 'sudo': {
  const fullCmd = rawCmd.toLowerCase();
  if (fullCmd.includes('rm -rf')) {
    setIsKernelPanic(true);
    setPanicProgress(0);
    unlockAchievement('secret-agent');
    
    const lines = [
      'WARNING: Root partition deletion requested.',
      'Initializing administrative wiping protocol...',
      'Wiping /bin ... [OK]',
      'Wiping /etc ... [OK]',
      'Wiping /lib ... [OK]',
      'Wiping /sys ... [OK]',
      'Wiping /usr ... [OK]',
      'Wiping local cache ... [CRITICAL PRE-CONDITION FAIL]',
      '!!! EXCEPTION: KERNEL PANIC !!!',
    ];
    // Dynamic timed cascade follows...
  }
}`,
    },
  },
  PacketHound: {
    'src/sniffer.rs': {
      language: 'rust',
      name: 'sniffer.rs',
      content: `use std::net::IpAddr;

#[derive(Debug)]
pub struct PacketHeader {
    pub source_ip: IpAddr,
    pub dest_ip: IpAddr,
    pub protocol: u8,
    pub payload_len: u16,
}

pub struct SocketTelemetry {
    socket_handle: i32,
    buffer: Vec<u8>,
}

impl SocketTelemetry {
    pub fn new() -> Result<Self, std::io::Error> {
        // Simulating raw socket binding (AF_INET, SOCK_RAW, IPPROTO_TCP)
        Ok(SocketTelemetry {
            socket_handle: 4,
            buffer: vec![0; 65536],
        })
    }

    pub fn capture_next(&mut self) -> Option<PacketHeader> {
        // Parse network byte packets and map fields
        if self.buffer.is_empty() {
            return None;
        }
        
        Some(PacketHeader {
            source_ip: "192.168.1.45".parse().unwrap(),
            dest_ip: "10.0.0.1".parse().unwrap(),
            protocol: 6, // TCP
            payload_len: 1248,
        })
    }
}`,
    },
  },
  Noesis: {
    'ml/inference.py': {
      language: 'python',
      name: 'inference.py',
      content: `import numpy as np

def cosine_similarity(v1, v2):
    """
    Calculates semantic search alignment score between two vector embeddings.
    """
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
        
    return float(dot_product / (norm_v1 * norm_v2))

class InferenceHub:
    def __init__(self, dimension=128):
        self.dim = dimension
        self.database = {} # Maps label -> vector

    def add_vector(self, label, vector):
        if len(vector) != self.dim:
            raise ValueError(f"Vector dimension must be {self.dim}")
        self.database[label] = np.array(vector)

    def semantic_query(self, query_vector, limit=3):
        results = []
        qv = np.array(query_vector)
        for label, vector in self.database.items():
            sim = cosine_similarity(qv, vector)
            results.append((label, sim))
            
        # Sort in descending order of similarity
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:limit]`,
    },
  },
};

export const getProjectCodeTree = (repoName: string, defaultLanguage: string): CodeTree => {
  if (PROJECT_CODE_DATA[repoName]) {
    return PROJECT_CODE_DATA[repoName];
  }

  // Generate generic mock files based on repository name
  const safeName = repoName.replace(/[^a-zA-Z0-9]/g, '');
  const ext = defaultLanguage?.toLowerCase() === 'python' ? 'py' : 
              defaultLanguage?.toLowerCase() === 'go' ? 'go' :
              defaultLanguage?.toLowerCase() === 'rust' ? 'rs' : 'ts';
              
  const lang = defaultLanguage?.toLowerCase() === 'python' ? 'python' : 
               defaultLanguage?.toLowerCase() === 'go' ? 'go' :
               defaultLanguage?.toLowerCase() === 'rust' ? 'rust' : 'typescript';

  return {
    [`src/main.${ext}`]: {
      name: `main.${ext}`,
      language: lang as any,
      content: `// Dynamic mock source file for ${repoName}
// Primary language: ${defaultLanguage}

export function initialize${safeName}() {
  console.log("Initializing ${repoName} runtime configuration...");
  const metrics = calculateDiagnosticMetrics();
  console.log("Telemetry logs staged: [OK]");
  return metrics;
}

function calculateDiagnosticMetrics() {
  const latency = Math.random() * 85 + 15;
  const errorRate = Math.random() * 0.02;
  return {
    latencyMs: latency.toFixed(2),
    cpuLoadPercent: (Math.random() * 45 + 10).toFixed(1),
    errorRate: (errorRate * 100).toFixed(3) + "%"
  };
}

initialize${safeName}();`,
    },
    'README.md': {
      name: 'README.md',
      language: 'markdown',
      content: `# ${repoName}

This is a dynamic template repository configuration for **${repoName}**.

## Staged Architecture
- Strictly-typed interface models.
- Live system telemetry tracking integration.
- Responsive simulation dashboard utilities.
`,
    },
  };
};
