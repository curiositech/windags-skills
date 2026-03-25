# Exception Hierarchies as Failure Specification Language: Making Coordination Failures Interpretable

## The Problem: Failures Are Information-Free

In most distributed systems, when a request fails, you get an error code:

- HTTP 400: Bad Request
- HTTP 403: Forbidden
- HTTP 500: Internal Server Error
- HTTP 503: Service Unavailable

These tell you *something* went wrong, but rarely *what specifically* went wrong in a way that enables recovery:

- 400 Bad Request: Was it malformed JSON? Missing required field? Invalid value? Type error?
- 403 Forbidden: Not authenticated? Not authorized? Wrong permissions on what resource?
- 500 Internal Server Error: Database down? Null pointer exception? Out of memory?

Intelligent agents coordinating complex tasks need **actionable failure information**. The FIPA specification (section 6.3) solves this with an **exception hierarchy** that turns failures into structured data.

## The Exception Selection Rules

FIPA defines **when** to use each communicative act for failures (section 6.3.1):

### Rule 1: Not Understood