# The Primary Knower Inversion: When Roles Contaminate Information Quality

## The Fundamental Tension

In most educational settings, the teacher is the "primary knower" — the holder of authoritative knowledge. Students are secondary knowers who provide responses evaluated against teacher knowledge. The IRF (Initiation-Response-Feedback) exchange structure reflects this: the teacher initiates, the student responds, the teacher evaluates.

Research interviews with students invert this structure. The student is the primary knower — the holder of information (about their own learning strategies, experiences, and perceptions) that the interviewer cannot possess. The interviewer's role is to elicit, not to evaluate.

But in practice, Adamson finds, this inversion is systematically undermined by **role contamination**: the leaked-in assumption, held by both interviewer and interviewee, that the teacher retains authority even in the interview room.

Berry (1981) coined the term "primary knower" precisely to mark this distinction. When the interviewer is also the student's teacher, the distinction collapses.

## How Role Contamination Manifests

**On the interviewer side:**
Adamson catches himself providing evaluative feedback — endorsing responses he personally agrees with — despite having consciously decided to provide only non-evaluative acknowledging feedback.

> "Most endorsement was employed in latter interviews with the more aware and linguistically competent interviewees... the fear that Nassaji and Wells (2000) express of eventual suppression of extended responses if classroom-like turn-taking is replicated is not substantiated in my interview data." (p. 152–153)

The endorsement was subconscious. The decision to avoid it was conscious. The conscious decision lost. This is a significant finding for any system or practitioner who believes that knowing about a bias is sufficient to avoid it.

**On the interviewee side:**
Students calibrated their responses to perceived teacher expectations rather than to factual accuracy or genuine elaboration. Burin's sparse, accurate responses were the output of a student optimizing for classroom evaluation norms:

> "In Burin's eyes, his own turn-taking behaviour may have been actually appropriate according to his experiences, indeed according to how his previous English teacher expected him to respond. Following this argument, his short responses may have been his attempt to earn merit, bun." (p. 163)

The student was correct that short, accurate answers earn merit — in classrooms. The interview was not a classroom, but the student had no available behavioral repertoire that distinguished between the two.

**The "hangover" concept:**
McCarthy (1991) calls this the "hangover from the classroom" — the persistence of classroom-derived interaction norms into non-classroom settings. In McCarthy's formulation, the teacher always retains "dominant rights to interrupt, overlap, take turns and finish interaction" regardless of the setting.

For Thai participants, this hangover was compounded by cultural norms that assign deference to authority figures across all contexts. The interview room was not a space the students could perceive as authority-neutral.

## The Structural Consequence

When role contamination is active, the interview produces not data about the student's actual knowledge or experience, but **data about the student's performance of the expected student role**. This is a fundamental validity problem.

The student being asked "What strategies do you use for note-taking?" is not answering about their actual note-taking behavior. They are answering about what a good student should say about note-taking behavior to a teacher who has asked.

Adamson notes, following Briggs (1986) and Block (2000), that interviewee responses may represent a "voice" that is not the student's own individual perspective but rather the expected voice of a Thai student:

> "The question must be asked as to what extent the Thai participants were giving responses which represented Thais in general or themselves individually." (p. 186)

## The Double-Blind Nature of the Problem

What makes this particularly difficult is that **both participants may be unaware of the contamination**. The interviewer believes they are conducting a research interview. The interviewee believes they are... also in some kind of test? A meeting with a superior? A strange classroom? The disambiguation of the speech event is never complete.

> "Both research areas served the same overall purpose which was to improve the quality of the teaching-learning process in the college. Without the knowledge gained from research undertaken into both areas, there existed the danger that the interviewing process would in the future yield inaccurate data." (p. 14–15)

The solution Adamson gestures toward — making the research purpose explicit, approaching students on "neutral territory," providing written consent forms explaining the purpose — is partial at best. The power differential between teacher and student is not dissolved by information about research purposes.

## The Asymmetry of Attempts at Symmetry

Adamson's attempts to create a more informal, symmetrical interview environment may have made things *worse*:

> "Attempts to de-formalise interviewing in the Thai setting may be regarded by the student-respondents as being contrary to their adherence to 'krengjai' — a reluctance to challenge authority figures face to face." (p. 59)

Thai participants who expected formal, asymmetrical interaction with a teacher-researcher may have been *confused* by attempts at informality. The expected script was formal; the actual script was inconsistently formal. This inconsistency generated uncertainty rather than relaxation.

This is the paradox: the interviewer's good intentions (creating a more egalitarian space) may have created a *more* constrained and confusing interaction for participants whose cultural norms expect and are comfortable with formal asymmetry.

## Application to Agent Systems

**Principle 1: Know which role you are occupying and whether the other party knows it too.** An AI agent interacting with a user may be occupying multiple roles simultaneously: information provider, task executor, evaluator, support system. When the roles are ambiguous, the user's responses will be contaminated by their assumptions about which role is active.

**Principle 2: Evaluation and elicitation are incompatible in the same agent.** When an agent both evaluates user inputs and elicits further information, users will optimize their inputs for evaluation rather than for accuracy or helpfulness. This is role contamination at the system design level. Separate the evaluator from the elicitor.

**Principle 3: The prior relationship between parties shapes what is expressible.** An agent that has previously evaluated a user's work has established a power-differential context that persists into subsequent interactions. Users will not freely admit confusion or error to an agent that they associate with evaluation. Context-setting mechanisms ("in this conversation, I am only here to help, not to evaluate") may be necessary — but may not be sufficient.

**Principle 4: Attempts to equalize asymmetric relationships may backfire.** An agent designed to appear humble, peer-like, or deferential may confuse users whose expectation is that the agent holds authority. Adjust the interaction style to the cultural and contextual expectations of the user, not to abstract principles of egalitarianism.

**Principle 5: Distinguish performance from genuine state.** When a user provides positive signals (approval, agreement, enthusiasm), consider whether this represents genuine satisfaction or role-performance. Systems that treat all positive signals as genuine will be miscalibrated.

## Boundary Conditions

Role contamination is most severe when:
- The same entity occupies both the evaluator and elicitor roles across contexts
- The power differential between parties is large and culturally reinforced
- The participants do not share an explicit frame for the current interaction type

It is reduced when:
- The interaction purpose is unambiguous to both parties
- The elicitor has no evaluative power over the respondent
- Cultural norms support direct expression of confusion and disagreement