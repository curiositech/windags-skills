---
name: python-asyncio-pitfalls
description: 'Use when debugging asyncio event-loop hangs, blocking calls inside coroutines, asyncio.gather vs TaskGroup choice, cancellation handling, structured concurrency, mixing sync and async, run_in_executor decisions, asyncio task lifetimes, "Task was destroyed but it is pending" warnings, or async context manager bugs. Triggers: event loop blocked by sync I/O, ConnectionResetError on cancellation, asyncio in libraries that also offer sync API, FastAPI/aiohttp performance regressions, queue.Queue used in async code. NOT for trio/anyio (different paradigm), threading without asyncio, or Python 2 sync patterns.'
category: AI & Machine Learning
tags:
  - python
  - asyncio
  - concurrency
  - performance
  - taskgroup
  - structured-concurrency
---

# Python Asyncio Pitfalls

Asyncio is cooperative — one blocking call freezes the entire event loop. Most "asyncio is slow" stories are actually "we accidentally called a synchronous function inside a coroutine." This catalogs the traps.

## When to use

- Performance debug: a single slow request blocks all others.
- `RuntimeError: This event loop is already running` or "Task was destroyed but it is pending".
- Choosing between `asyncio.gather`, `asyncio.TaskGroup` (3.11+), and `asyncio.wait`.
- Cancellation isn't propagating; child tasks keep running.
- Mixing a sync library with async code without freezing the loop.

## Core capabilities

### Detect blocking calls in the event loop

```python
import asyncio

async def main():
    loop = asyncio.get_running_loop()
    loop.set_debug(True)         # warns when a coroutine takes too long
    # PYTHONASYNCIODEBUG=1 also enables debug mode at the env var level
```

Debug mode logs:
```
Executing <Task ... took 0.250 seconds
```

For production, instrument with `loop.slow_callback_duration = 0.1`. Anything over 100ms means a blocking call slipped in.

### TaskGroup — structured concurrency (Python 3.11+)

```python
async def fetch_all(urls: list[str]) -> list[str]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(u)) for u in urls]
    return [t.result() for t in tasks]   # exceptions raised here
```

If any task raises, all siblings are cancelled and the exception (or `ExceptionGroup`) propagates out. This is the safe default.

`asyncio.gather` semantics:

```python
results = await asyncio.gather(fetch(a), fetch(b), return_exceptions=True)
# Without return_exceptions=True, the first exception cancels nothing — siblings keep running.
```

Use `gather` only when you want the older fire-and-collect-errors semantics; `TaskGroup` for everything else.

### Mixing sync code

```python
# WRONG — blocks the loop.
async def slow():
    return time.sleep(2)         # NOT awaitable; runs sync, blocks loop

# RIGHT — offload to a thread.
async def slow():
    return await asyncio.to_thread(time.sleep, 2)
```

`asyncio.to_thread` (3.9+) runs the function in a thread from the default executor. For CPU-bound work, use a `ProcessPoolExecutor` and `loop.run_in_executor`:

```python
import concurrent.futures
loop = asyncio.get_running_loop()
with concurrent.futures.ProcessPoolExecutor() as pool:
    result = await loop.run_in_executor(pool, expensive_pure_function, arg)
```

### Cancellation that actually works

```python
async def with_cleanup():
    try:
        await long_operation()
    except asyncio.CancelledError:
        await cleanup()
        raise                    # re-raise so the caller knows you were cancelled
    return result
```

Swallowing `CancelledError` is a common cause of "task was destroyed but it is pending" warnings. Always re-raise unless you're explicitly catching to ignore.

### Context propagation across tasks

```python
import contextvars

request_id = contextvars.ContextVar('request_id')

async def handler(rid: str):
    request_id.set(rid)
    # Spawned tasks inherit ContextVar values automatically.
    asyncio.create_task(log_async())
```

Use ContextVars for request-scoped data instead of thread-locals; threading.local doesn't work right in asyncio.

### Async iterators and generators

```python
async def stream_chunks(reader: asyncio.StreamReader):
    while not reader.at_eof():
        chunk = await reader.read(4096)
        if not chunk:
            break
        yield chunk

async for chunk in stream_chunks(reader):
    process(chunk)
```

`async for` is the right way to consume async iterators; pulling them with `__anext__` directly is rarely correct.

### Timeouts

```python
# 3.11+ — preferred
async with asyncio.timeout(5):
    result = await long_call()

# Older — wait_for
result = await asyncio.wait_for(long_call(), timeout=5)
```

`asyncio.timeout` integrates with TaskGroup; `wait_for` doesn't and can cause a double-cancel surprise.

### Queues

`asyncio.Queue` is the right choice; `queue.Queue` is sync and would block.

```python
queue: asyncio.Queue[Job] = asyncio.Queue(maxsize=100)

async def producer():
    while item := await source():
        await queue.put(item)

async def consumer():
    while True:
        job = await queue.get()
        try:
            await process(job)
        finally:
            queue.task_done()

await queue.join()   # wait until all submitted jobs marked done
```

`maxsize` provides backpressure — without it, a fast producer can OOM you.

### Async context managers and locks

```python
lock = asyncio.Lock()

async with lock:
    await critical_section()
```

Don't share an `asyncio.Lock` across event loops; each loop has its own.

### FastAPI / aiohttp specifics

- Use `async def` route handlers when you have async I/O. Sync handlers run in a threadpool — fine, but you pay the thread overhead.
- Connection pools (`httpx.AsyncClient`, asyncpg pool) belong at app startup, shared across requests. Don't construct per-request.
- Background tasks: `BackgroundTasks` (FastAPI) for fire-and-forget; `asyncio.create_task` if you need to track.

## Anti-patterns

### Calling sync I/O inside a coroutine

**Symptom:** Throughput craters under load; one slow request blocks everything.
**Diagnosis:** `requests.get`, `time.sleep`, `psycopg2.execute` — all sync, all block the loop.
**Fix:** Switch to async libraries (`httpx.AsyncClient`, `asyncio.sleep`, `asyncpg`). For sync libraries you can't replace, `asyncio.to_thread`.

### Forgetting to await a coroutine

**Symptom:** `coroutine 'fn' was never awaited` warning. No error, no return value.
**Diagnosis:** `result = fn()` instead of `result = await fn()`.
**Fix:** Add the await. Linters (ruff, pylint) flag this; turn the rule on.

### `asyncio.gather` without `return_exceptions=True` when you want to wait for all

**Symptom:** Partial work; some tasks ran, others mysteriously didn't.
**Diagnosis:** First exception propagates and the siblings are NOT cancelled — they keep running detached.
**Fix:** Use `TaskGroup` (cancels siblings cleanly) or `gather(*coros, return_exceptions=True)` followed by manual handling.

### Swallowing `CancelledError`

**Symptom:** "Task was destroyed but it is pending" warning at shutdown.
**Diagnosis:** A task caught CancelledError without re-raising; the runtime never finished cleanup.
**Fix:** Always re-raise after cleanup. Use try/finally for cleanup that must run regardless.

### Sharing an event loop across threads

**Symptom:** `RuntimeError: This event loop is already running` or sporadic data corruption.
**Diagnosis:** Calling `loop.run_until_complete` from a thread other than the loop's owner.
**Fix:** Use `asyncio.run_coroutine_threadsafe(coro, loop)` from non-loop threads.

### Unbounded `asyncio.Queue`

**Symptom:** OOM under burst load.
**Diagnosis:** Producer faster than consumer; queue grows unbounded.
**Fix:** Set `maxsize` on the queue. Producer awaits `put` and naturally blocks.

## Quality gates

- [ ] No sync I/O calls inside async code paths (linted via ruff `ASYNC1*` rules).
- [ ] `TaskGroup` used for fan-out where any failure should cancel siblings.
- [ ] `asyncio.timeout(...)` (or `wait_for`) wraps every external call.
- [ ] Connection pools constructed at startup; shared per process.
- [ ] `CancelledError` always re-raised after cleanup.
- [ ] `asyncio.Queue(maxsize=…)` has explicit backpressure.
- [ ] `loop.set_debug(True)` enabled in dev; `slow_callback_duration` alerts in prod.
- [ ] ContextVars used for request-scoped state.

## NOT for

- **trio / anyio** — different structured-concurrency primitives; different mental model.
- **threading without asyncio** — multiprocessing/threading have different deadlock patterns.
- **Python 2 sync patterns** — different language era.
- **gevent / eventlet** — monkey-patching greenlets, separate ecosystem.
