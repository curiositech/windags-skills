# Surface Selection Scenarios

Use these as trigger examples for deciding the right desktop surface.

## Scenario 1

**Prompt**: “I need a live metadata view for whatever node the user clicks.”

**Choose**: trailing inspector pane or inspector panel  
**Do not choose**: separate document-style window

Reason: the content follows current selection.

## Scenario 2

**Prompt**: “I want users to compare two independent graphs on different monitors.”

**Choose**: auxiliary comparison window  
**Do not choose**: a tiny secondary pane inside the main window

Reason: the task has its own lifecycle and may live on another display.

## Scenario 3

**Prompt**: “I need export options before generating a PDF.”

**Choose**: sheet/modal  
**Do not choose**: permanent settings panel

Reason: the task is short, blocking, and not worth persistent spatial state.

## Scenario 4

**Prompt**: “The graph and its exported task list should be visible during review.”

**Choose**: one primary window with panes or tabs depending on width  
**Do not choose**: two peer floating windows by default

Reason: the surfaces belong to the same review context.
