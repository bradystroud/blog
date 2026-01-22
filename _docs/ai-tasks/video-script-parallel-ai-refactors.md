# Video Script: I Refactored a Modular Monolith with 15 AI Agents

**Duration:** 3-5 minutes  
**Style:** Screen recording with voiceover  
**Tone:** Technical but accessible, excited but practical

---

## [INTRO - 0:00-0:20]

### Visual
- Screen showing a large codebase with multiple modules/folders
- Quick cuts between different files showing repetitive code patterns

### Voiceover
"I just refactored an entire modular monolith in about 20 minutes. Not with clever prompts. Not with a better AI model. But with 15 AI agents working in parallel. Here's how."

---

## [THE PAIN - 0:20-0:50]

### Visual
- Show directory structure of modular monolith
- Highlight similar files across different modules
- Quick terminal command showing total files affected (e.g., "127 files to change")

### Voiceover
"Modular monoliths are great for organization, but terrible when you need to make a cross-cutting change. Imagine renaming a base class, updating an error handling pattern, or migrating to a new API structure across dozens of modules. It's the same change, repeated 50 times. Traditionally, this is a nightmare. Even with AI, it's still linear. One file at a time."

---

## [OLD WAY - 0:50-1:20]

### Visual
- Screen recording: Single OpenCode session
- Show agent working through files one by one
- Timer in corner showing elapsed time
- Progress bar moving slowly

### Voiceover
"With a single AI agent, this is already way better than doing it manually. You write the refactor plan once, and the agent executes it. But here's the problem: it's still sequential. The agent processes one module, then another, then another. For 20 modules, you're waiting. A lot."

**[TEXT OVERLAY]:** "Single Agent: ~2 hours for full refactor"

---

## [BREAKTHROUGH 1: PARALLEL SESSIONS - 1:20-2:00]

### Visual
- Split screen showing 3 OpenCode sessions opening
- Show the shared markdown file: `/docs/refactor-ai.md`
- Quick cuts between sessions, each working on different modules
- Show checklist items being ticked off

### Voiceover
"Here's the first breakthrough: multiple sessions. I opened three OpenCode windows, assigned each one a different module, and pointed them all at the same refactor plan. They're all reading from and updating the same markdown checklist. Now we're getting somewhere. But I can do better."

**[TEXT OVERLAY]:** "3 Sessions: ~40 minutes"

---

## [BREAKTHROUGH 2: SUB-AGENTS - 2:00-3:00]

### Visual
- Show the `.opencode/agents.md` or `AGENTS.md` file
- Highlight the sub-agent definition
- Screen recording: Type a simple command like "@refactor-module Payments"
- Show the agent spawning multiple sub-agents
- Dashboard/terminal showing parallel tasks running
- Multiple progress indicators moving simultaneously

### Voiceover
"But here's where it gets wild: sub-agents. Instead of manually spinning up sessions, I created a custom sub-agent that knows how to refactor a module. I encoded the entire process into a reusable agent definition. Now, instead of copy-pasting prompts, I just tag the agent, give it a module name, and it spawns its own workers. 

So I opened five sessions. Each one spawned three sub-agents. That's 15 AI agents, all working on the same refactor, all following the same plan, all coordinating through the shared checklist."

**[TEXT OVERLAY]:** "5 Sessions × 3 Sub-agents = 15 Parallel Workers"

---

## [THE RESULT - 3:00-3:30]

### Visual
- Time-lapse of all sessions working
- Git diff showing massive changes
- Final commit with stats (e.g., "127 files changed, 2,450 insertions, 1,890 deletions")
- Show the checklist fully completed

### Voiceover
"Twenty minutes later, done. Every module refactored. Every test passing. All coordinated through a single markdown file that served as our shared source of truth. This isn't about better prompts. This is about architecture. Treating your refactor as a distributed system problem."

**[TEXT OVERLAY]:** "15 Agents: ~20 minutes"

---

## [WHAT THIS UNLOCKS - 3:30-4:00]

### Visual
- Show the key files:
  - `/docs/refactor-ai.md` (the plan)
  - `AGENTS.md` (the sub-agent config)
- Quick montage of other potential refactors:
  - "Migrate from REST to GraphQL"
  - "Update error handling patterns"
  - "Rename core abstractions"

### Voiceover
"This unlocks a completely different way of thinking about architecture. Massive refactors that you'd previously avoid? Now they're cheap. That framework migration you've been putting off? Totally doable. You're not writing code anymore. You're orchestrating systems."

---

## [WARNINGS - 4:00-4:20]

### Visual
- Show OpenCode/AI credits being consumed
- Highlight the planning files
- Show a code review interface

### Voiceover
"Fair warning: this burns through AI credits fast. You need extremely clear plans that machines can execute. And you still need to review the output carefully. But for the right refactors, this is a superpower."

---

## [TAKEAWAY - 4:20-4:50]

### Visual
- Return to the key files
- Show GitHub repo link appearing on screen
- Your blog URL

### Voiceover
"The key insight: write your refactor plans like distributed system instructions. Make them machine-executable. Then let parallelism do what it does best. I've put the demo repo, the full refactor plan, and the sub-agent configs in the description. Try it yourself. Stop doing refactors alone."

**[TEXT OVERLAY]:** 
- "Demo Repo: github.com/yourname/parallel-refactor-demo"
- "Full Write-up: bradystroud.dev/blogs/parallel-ai-refactors"

---

## [OUTRO - 4:50-5:00]

### Visual
- Quick montage of all the parallel sessions working
- Fade to black
- Subscribe/like prompt

### Voiceover
"Let me know what you build with this. Thanks for watching."

---

## 🎬 Production Notes

### Key Visuals to Capture
1. **Split-screen sessions** - Show multiple OpenCode windows simultaneously
2. **The markdown checklist** - Central coordinating document being updated
3. **Git diffs** - Showing the scale of changes
4. **Time comparisons** - Visual comparison of single agent vs parallel approach
5. **Agent definition file** - The secret sauce that makes sub-agents work

### B-Roll Ideas
- Terminal commands starting sessions
- File tree expanding/collapsing
- Tests running and passing
- Commit history being created
- Credit consumption dashboard (if available)

### Text Overlays to Prepare
- Time comparisons (2 hours → 40 min → 20 min)
- Agent counts (1 → 3 → 15)
- File change statistics
- Repo and blog URLs

### Audio Notes
- Keep pace energetic but not rushed
- Emphasize key numbers (15 agents, 20 minutes, 127 files)
- Pause briefly after major reveals (sub-agents, time saved)

### Editing Tips
- Use speed ramps for time-lapses of agents working
- Add subtle progress bar animations
- Use highlight boxes/arrows to draw attention to key parts of code
- Keep cuts tight - this should feel fast-paced like the refactor itself

---

## 📋 Pre-Recording Checklist

- [ ] Demo repo ready with clear before/after commits
- [ ] `/docs/refactor-ai.md` file created and formatted
- [ ] `AGENTS.md` sub-agent definitions working
- [ ] Practice run of full refactor to verify timing
- [ ] Screen recording software tested (3000x2000 min resolution)
- [ ] Audio setup tested (clear mic, no background noise)
- [ ] Multiple OpenCode sessions confirmed working
- [ ] Git history clean and demonstrative
- [ ] Blog post drafted (for URL in video)

---

## 🔗 Call-to-Action Links

Include in video description:
- Demo repository (with templates)
- Blog post with detailed walkthrough
- AGENTS.md template for reuse
- Refactor plan template
- Your Twitter/social for discussion
