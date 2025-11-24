import React from 'react';
import { BookOpen, BrainCircuit, Code2, Cpu, Database, FileCode, Layers, Terminal, Split, Keyboard } from 'lucide-react';
import { LearningStep } from './types';

export const LEARNING_STEPS: LearningStep[] = [
  {
    id: 'intro',
    title: 'Introduction & Setup',
    subtitle: 'How to use this Clone Coding Studio',
    icon: <BookOpen className="w-5 h-5" />,
    description: "Welcome to the GPT-3 Builder. This is an interactive environment designed to help you write the code for a GPT model from scratch.",
    content: (
      <div className="space-y-6 text-slate-300">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🚀 How to Start Clone Coding
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-[-4px]">
                <Code2 size={18} />
              </div>
              <div>
                <strong className="text-white block mb-1">1. Open the 'Implementation' Tab</strong>
                This is where the code lives. You will see a code editor.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-[-4px]">
                <Split size={18} />
              </div>
              <div>
                <strong className="text-white block mb-1">2. Toggle 'Split View'</strong>
                Click the <span className="inline-block px-2 py-0.5 rounded bg-slate-700 text-xs mx-1">Split View</span> button. 
                This will show the <strong>Reference Solution</strong> (Answer) on the left and <strong>Your Workspace</strong> on the right.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-[-4px]">
                <Keyboard size={18} />
              </div>
              <div>
                <strong className="text-white block mb-1">3. Type the Code</strong>
                Don't just copy-paste! Type the implementation into your workspace. The skeleton code guides you with comments like <code># TODO</code>.
              </div>
            </li>
          </ul>
        </div>

        <p>
          We will start by defining the <strong>configuration</strong> for our model. This sets the hyperparameters like depth (layers), width (embedding size), and context window.
        </p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'config.py',
        skeleton: `import torch
import torch.nn as nn
from torch.nn import functional as F
from dataclasses import dataclass

# TODO: Define the Hyperparameters for our GPT model
@dataclass
class GPTConfig:
    # 1. Context window size (how many tokens it looks back)
    block_size: int = 1024 
    
    # 2. Vocabulary size (GPT-2/3 uses 50257)
    vocab_size: int = 50257 
    
    # 3. Model depth and width
    n_layer: int = 12
    n_head: int = 12
    n_embd: int = 768
    
    # 4. Regularization
    dropout: float = 0.1
    
    # 5. Layer configuration
    bias: bool = True # True: bias in Linears/LayerNorms`,
        code: `import torch
import torch.nn as nn
from torch.nn import functional as F
from dataclasses import dataclass

# Hyperparameters for our mini-GPT
@dataclass
class GPTConfig:
    block_size: int = 1024 # Context window size
    vocab_size: int = 50257 # GPT-2/3 vocab size
    n_layer: int = 12
    n_head: int = 12
    n_embd: int = 768
    dropout: float = 0.1
    bias: bool = True # True: bias in Linears/LayerNorms`
      }
    ],
    simulation: {
      type: 'none',
      placeholder: "System Ready. Go to the next step to build Embeddings.",
      buttonLabel: "Start Building",
      description: "Your environment is set up. The configuration is ready. Move to the 'Embeddings' step to start coding the neural network layers."
    }
  },
  {
    id: 'embeddings',
    title: 'Embeddings & Positional Encoding',
    subtitle: 'Converting text to vectors',
    icon: <Database className="w-5 h-5" />,
    description: "First, we convert text into numbers (vectors). Without the Transformer blocks, the model is just a lookup table. It doesn't know grammar yet.",
    content: (
      <div className="space-y-4 text-slate-300">
        <p>Implement the `GPTEmbeddings` class. Remember, GPT uses learned positional embeddings, not sinusoidal ones like the original Transformer.</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'embeddings.py',
        skeleton: `class GPTEmbeddings(nn.Module):
    def __init__(self, config):
        super().__init__()
        # TODO: Create the Token Embedding Table (wte)
        # Shape: [vocab_size, n_embd]
        self.wte = ...
        
        # TODO: Create the Position Embedding Table (wpe)
        # Shape: [block_size, n_embd]
        self.wpe = ...
        
        # TODO: Initialize Dropout layer
        self.drop = ...

    def forward(self, idx):
        # idx is shape [Batch, Time]
        b, t = idx.size()
        
        # TODO: Create position indices (0, 1, 2, ..., t-1)
        pos = ...
        
        # TODO: Lookup token and position embeddings
        tok_emb = ... 
        pos_emb = ...
        
        # TODO: Combine them and apply dropout
        x = ...
        return x`,
        code: `class GPTEmbeddings(nn.Module):
    def __init__(self, config):
        super().__init__()
        # 1. Token embeddings: Size [vocab_size, n_embd]
        self.wte = nn.Embedding(config.vocab_size, config.n_embd)
        
        # 2. Position embeddings: Size [block_size, n_embd]
        # Using learned positional embeddings (standard for GPT)
        self.wpe = nn.Embedding(config.block_size, config.n_embd)
        
        self.drop = nn.Dropout(config.dropout)

    def forward(self, idx):
        # idx is shape [Batch, Time]
        b, t = idx.size()
        pos = torch.arange(0, t, dtype=torch.long, device=idx.device)
        
        # Token embeddings + Position embeddings
        tok_emb = self.wte(idx) # [B, T, C]
        pos_emb = self.wpe(pos) # [T, C]
        
        x = self.drop(tok_emb + pos_emb)
        return x`
      }
    ],
    simulation: {
      type: 'none',
      placeholder: "Write something here...",
      buttonLabel: "Test Embeddings",
      description: "At this stage, the model only converts text to numbers. It cannot generate output yet."
    }
  },
  {
    id: 'attention',
    title: 'Causal Self-Attention',
    subtitle: 'The heart of the Transformer',
    icon: <BrainCircuit className="w-5 h-5" />,
    description: "Attention allows tokens to 'talk' to each other. 'Causal' means they can only talk to the past, not the future.",
    content: (
      <div className="space-y-4 text-slate-300">
        <p>This is the most complex part. We need to implement Multi-Head Attention and apply the causal mask so the model doesn't cheat by looking ahead.</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'attention.py',
        skeleton: `class CausalSelfAttention(nn.Module):
    def __init__(self, config):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        
        # TODO: Define Key, Query, Value projections
        # Hint: You can do this in one large Linear layer (3 * n_embd)
        self.c_attn = ...
        
        # TODO: Define Output projection
        self.c_proj = ...
        
        self.n_head = config.n_head
        self.n_embd = config.n_embd
        
        # TODO: Create the "Causal Mask" (Lower triangular matrix)
        # Use register_buffer so it's not treated as a trainable parameter
        self.register_buffer("bias", ...)

    def forward(self, x):
        B, T, C = x.size()
        
        # TODO: Calculate query, key, values from input x
        # TODO: Reshape for multi-head attention
        
        # TODO: Compute Scaled Dot-Product Attention
        # att = (q @ k) * scaling_factor
        
        # TODO: Apply Causal Mask (set future positions to -inf)
        # att = att.masked_fill(...)
        
        # TODO: Apply Softmax and aggregate values
        # y = att @ v
        
        # TODO: Reassemble heads and project output
        return ...`,
        code: `class CausalSelfAttention(nn.Module):
    def __init__(self, config):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        # key, query, value projections for all heads, but in a batch
        self.c_attn = nn.Linear(config.n_embd, 3 * config.n_embd, bias=config.bias)
        # output projection
        self.c_proj = nn.Linear(config.n_embd, config.n_embd, bias=config.bias)
        self.n_head = config.n_head
        self.n_embd = config.n_embd
        
        # Flash attention mask (tril matrix)
        self.register_buffer("bias", torch.tril(torch.ones(config.block_size, config.block_size))
                                    .view(1, 1, config.block_size, config.block_size))

    def forward(self, x):
        B, T, C = x.size() # Batch, Time, Channels
        
        # Calculate query, key, values
        q, k, v  = self.c_attn(x).split(self.n_embd, dim=2)
        
        # Reshape for multi-head attention: [B, n_head, T, head_size]
        k = k.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        q = q.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        v = v.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)

        # Causal Attention (The "G" in GPT)
        # (B, nh, T, hs) x (B, nh, hs, T) -> (B, nh, T, T)
        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        
        # MASKING: Don't look into the future
        att = att.masked_fill(self.bias[:,:,:T,:T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        
        # Aggregate values
        y = att @ v # (B, nh, T, T) x (B, nh, T, hs) -> (B, nh, T, hs)
        y = y.transpose(1, 2).contiguous().view(B, T, C)
        
        return self.c_proj(y)`
      }
    ],
    simulation: {
      type: 'none',
      placeholder: "Waiting for full block assembly...",
      buttonLabel: "Test Attention",
      description: "Attention is implemented, but we need the Feed Forward layers and Blocks to run the model."
    }
  },
  {
    id: 'block',
    title: 'The Transformer Block',
    subtitle: 'Stacking Layers',
    icon: <Layers className="w-5 h-5" />,
    description: "Combining Attention and Feed-Forward networks into a repeating block.",
    content: (
      <div className="space-y-4 text-slate-300">
        <p>A single Transformer Block consists of: LayerNorm -> Attention -> Residual Connection -> LayerNorm -> MLP -> Residual Connection.</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'block.py',
        skeleton: `class MLP(nn.Module):
    def __init__(self, config):
        super().__init__()
        # TODO: Implement a simple Multi-Layer Perceptron
        # Expand dimension by 4x, apply GELU, project back
        self.c_fc = ...
        self.gelu = ...
        self.c_proj = ...

    def forward(self, x):
        # TODO: Forward pass
        return ...

class Block(nn.Module):
    def __init__(self, config):
        super().__init__()
        # TODO: Initialize LayerNorm 1
        self.ln_1 = ...
        # TODO: Initialize CausalSelfAttention
        self.attn = ...
        # TODO: Initialize LayerNorm 2
        self.ln_2 = ...
        # TODO: Initialize MLP
        self.mlp = ...

    def forward(self, x):
        # TODO: Implement the residual connections
        # x = x + attn(ln1(x))
        # x = x + mlp(ln2(x))
        return x`,
        code: `class MLP(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.c_fc    = nn.Linear(config.n_embd, 4 * config.n_embd, bias=config.bias)
        self.gelu    = nn.GELU()
        self.c_proj  = nn.Linear(4 * config.n_embd, config.n_embd, bias=config.bias)

    def forward(self, x):
        x = self.c_fc(x)
        x = self.gelu(x)
        x = self.c_proj(x)
        return x

class Block(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.ln_1 = nn.LayerNorm(config.n_embd)
        self.attn = CausalSelfAttention(config)
        self.ln_2 = nn.LayerNorm(config.n_embd)
        self.mlp = MLP(config)

    def forward(self, x):
        x = x + self.attn(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x`
      }
    ],
    simulation: {
      type: 'none',
      placeholder: "Almost there...",
      buttonLabel: "Assemble Blocks",
      description: "Blocks are ready. Next step: The full model."
    }
  },
  {
    id: 'gpt_model',
    title: 'Full GPT Model (Base)',
    subtitle: 'Unsupervised Pre-training Result',
    icon: <Cpu className="w-5 h-5" />,
    description: "We have assembled the full model! This represents the 'Pre-trained' stage. The model knows grammar and facts, but it doesn't know how to follow instructions yet.",
    content: (
      <div className="text-slate-300">
        <p>It's time to put it all together. We stack <code>n_layer</code> blocks and add a final LayerNorm and Linear head.</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'gpt.py',
        skeleton: `class GPT(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        
        self.transformer = nn.ModuleDict(dict(
            # TODO: Add embeddings (wte, wpe)
            wte = ...,
            wpe = ...,
            drop = ...,
            
            # TODO: Create a list of N Blocks
            h = nn.ModuleList([...]),
            
            # TODO: Final LayerNorm
            ln_f = ...,
        ))
        
        # TODO: Language Modeling Head (projects to vocab_size)
        self.lm_head = ...

    def forward(self, idx, targets=None):
        b, t = idx.size()
        
        # TODO: Get embeddings
        
        # TODO: Pass through all blocks
        
        # TODO: Apply final LayerNorm
        
        if targets is not None:
            # TODO: Calculate CrossEntropyLoss
            loss = ...
        else:
            # TODO: Get logits for the last token only (for inference)
            logits = ...
            loss = None
            
        return logits, loss`,
        code: `class GPT(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        
        self.transformer = nn.ModuleDict(dict(
            wte = nn.Embedding(config.vocab_size, config.n_embd),
            wpe = nn.Embedding(config.block_size, config.n_embd),
            drop = nn.Dropout(config.dropout),
            h = nn.ModuleList([Block(config) for _ in range(config.n_layer)]),
            ln_f = nn.LayerNorm(config.n_embd),
        ))
        
        self.lm_head = nn.Linear(config.n_embd, config.vocab_size, bias=False)
        self.transformer.wte.weight = self.lm_head.weight

    def forward(self, idx, targets=None):
        b, t = idx.size()
        pos = torch.arange(0, t, dtype=torch.long, device=idx.device)
        
        tok_emb = self.transformer.wte(idx)
        pos_emb = self.transformer.wpe(pos)
        x = self.transformer.drop(tok_emb + pos_emb)
        
        for block in self.transformer.h:
            x = block(x)
            
        x = self.transformer.ln_f(x)
        
        if targets is not None:
            logits = self.lm_head(x)
            loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
        else:
            logits = self.lm_head(x[:, [-1], :])
            loss = None
            
        return logits, loss`
      }
    ],
    simulation: {
      type: 'completion',
      placeholder: "Type the start of a sentence (e.g., 'Once upon a time')...",
      buttonLabel: "Run Completion (Base Model)",
      systemPrompt: "You are a raw GPT base model. You are NOT an assistant. You simply complete the text provided by the user. Do not answer questions, just continue the pattern. If they ask 'What is the capital of France?', you might complete it with ' and its population is...'. Be creative but raw.",
      description: "Base Model Active. It simply predicts the next likely word."
    }
  },
  {
    id: 'instruction_tuning',
    title: 'Instruction Tuning (SFT)',
    subtitle: 'Supervised Fine-Tuning',
    icon: <FileCode className="w-5 h-5" />,
    description: "Now we train the model on (Instruction, Response) pairs. This turns the 'Completer' into an 'Assistant'.",
    content: (
      <div className="space-y-4 text-slate-300">
        <p>The architecture doesn't change! We just change the data and the loss calculation to focus on the response.</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'train_sft.py',
        skeleton: `def train_instruction_step(model, optimizer, batch_data):
    """
    batch_data format:
    input_ids: [INT, INT, INT, RESP, RESP, RESP]
    labels:    [-100, -100, -100, RESP, RESP, RESP]
    """
    model.train()
    
    # TODO: Zero gradients
    
    # TODO: Unpack batch data
    input_ids = ...
    labels = ...
    
    # TODO: Forward pass with targets
    logits, loss = ...
    
    # TODO: Backward pass and optimizer step
    
    return loss.item()`,
        code: `def train_instruction_step(model, optimizer, batch_data):
    """
    batch_data format:
    input_ids: [INT, INT, INT, RESP, RESP, RESP]
    labels:    [-100, -100, -100, RESP, RESP, RESP]
    """
    model.train()
    optimizer.zero_grad()
    
    input_ids = batch_data['input_ids']
    labels = batch_data['labels'] # -100 for instruction tokens
    
    # The model already handles CrossEntropy internally
    logits, loss = model(input_ids, targets=labels)
    
    loss.backward()
    optimizer.step()
    
    return loss.item()`
      }
    ],
    simulation: {
      type: 'chat',
      placeholder: "Ask a question or give an instruction...",
      buttonLabel: "Run Assistant (SFT Model)",
      systemPrompt: "You are an instruction-tuned GPT model. You are helpful, harmless, and honest. Answer the user's request directly and concisely.",
      description: "SFT Model Active. It follows instructions and answers questions."
    }
  },
  {
    id: 'classification_tuning',
    title: 'Classification Tuning',
    subtitle: 'Fine-tuning for Labels',
    icon: <Terminal className="w-5 h-5" />,
    description: "We replace the language head with a classification head. The model now outputs categories (e.g., Sentiment) instead of text.",
    content: (
      <div className="space-y-4 text-slate-300">
        <p>Here we actually modify the architecture slightly. We remove <code>lm_head</code> (vocab size) and add a <code>score</code> head (num labels).</p>
      </div>
    ),
    codeSnippets: [
      {
        language: 'python',
        filename: 'classifier_gpt.py',
        skeleton: `class GPTForSequenceClassification(nn.Module):
    def __init__(self, config, num_labels):
        super().__init__()
        # TODO: Initialize base GPT model
        self.gpt = GPT(config)
        
        # TODO: Remove the language model head (we don't need it)
        del self.gpt.lm_head 
        
        # TODO: Add a classification head (linear layer -> num_labels)
        self.score = ...

    def forward(self, idx, labels=None):
        # TODO: Get hidden states from GPT
        # Hint: You might need to modify GPT to return hidden states
        hidden_states = ...
        
        # TODO: Extract the embedding of the last token
        last_token_emb = ...
        
        # TODO: Compute logits using the classification head
        logits = ...
        
        loss = None
        if labels is not None:
            # TODO: Compute loss
            loss = ...
            
        return logits, loss`,
        code: `class GPTForSequenceClassification(nn.Module):
    def __init__(self, config, num_labels):
        super().__init__()
        self.gpt = GPT(config)
        del self.gpt.lm_head 
        self.score = nn.Linear(config.n_embd, num_labels, bias=False)

    def forward(self, idx, labels=None):
        hidden_states = self.gpt.get_hidden_states(idx) 
        last_token_emb = hidden_states[:, -1, :]
        logits = self.score(last_token_emb)
        
        loss = None
        if labels is not None:
            loss = F.cross_entropy(logits, labels)
        return logits, loss`
      }
    ],
    simulation: {
      type: 'classification',
      placeholder: "Type a sentence to classify (e.g., product review)...",
      buttonLabel: "Classify Sentiment",
      systemPrompt: "You are a specific purpose classification model based on GPT. Your task is to classify the sentiment of the input text. Return ONLY the JSON object: {\"label\": \"POSITIVE\" | \"NEGATIVE\" | \"NEUTRAL\", \"confidence\": float}. Do not output any markdown or explanation.",
      description: "Classifier Model Active. It outputs specific labels."
    }
  }
];