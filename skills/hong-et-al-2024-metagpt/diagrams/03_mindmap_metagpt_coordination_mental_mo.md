# MetaGPT Coordination Mental Models Hierarchy

```mermaid
mindmap
  root((MetaGPT Coordination<br/>Mental Models))
    SOPs as Coordination Protocols
      Compress organizational knowledge
      Decompose complex problems systematically
      Import centuries of human learning
      Task completion improves from <20% to 100%
      Application: Find human SOP → Encode as agent roles
    Structured Communication
      Prevents hallucination cascades
      Eliminate ambiguity at each handoff
      Format matters more than content
      Use required schemas and templates
      Application: Define artifact formats per handoff
    Executable Feedback
      Ground LLM confidence in reality
      Run code, call APIs, test outputs
      Concrete verification beats abstract review
       4-5% improvement from execution feedback
      Application: Design feedback loops with real execution
    Publish-Subscribe Architecture
      Decouple senders and receivers
      Avoid O(n²) point-to-point complexity
      Agents publish to shared message pool
      Subscribe by information type, not agent identity
      Application: Design around message types not communication graphs
    Role Specialization
      Create tractable bounded sub-problems
      Clear deliverables and success criteria
      Constraints enable, don't limit
      Define agents by output, not capability
      Application: Architect→design doc, Engineer→code, QA→test report
```
