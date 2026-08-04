#!/usr/bin/env python3
"""Double-fork daemon that keeps `bun run dev` alive detached from any shell."""
import os
import sys
import subprocess
import time

WORK_DIR = "/home/z/my-project"
LOG_PATH = "/home/z/my-project/dev.log"
PID_FILE = "/home/z/my-project/dev.pid"


def already_running():
    try:
        with open(PID_FILE) as f:
            pid = int(f.read().strip())
        os.kill(pid, 0)
        return pid
    except Exception:
        return None


def main():
    pid = already_running()
    if pid:
        print(f"already running pid={pid}")
        return

    # First fork
    if os.fork() != 0:
        # Parent — wait briefly for grandchild to write pid file, then exit.
        for _ in range(40):
            if os.path.exists(PID_FILE):
                try:
                    with open(PID_FILE) as f:
                        print(f"started pid={f.read().strip()}")
                except Exception:
                    pass
                return
            time.sleep(0.25)
        print("started (no pid file)")
        return

    # Decouple from parent environment
    os.setsid()
    os.umask(0)

    # Second fork
    if os.fork() != 0:
        os._exit(0)

    # Redirect stdio
    sys.stdout.flush()
    sys.stderr.flush()
    log_fd = os.open(LOG_PATH, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    devnull_fd = os.open(os.devnull, os.O_RDONLY)
    os.dup2(devnull_fd, 0)
    os.dup2(log_fd, 1)
    os.dup2(log_fd, 2)

    # Write pid file
    with open(PID_FILE, "w") as f:
        f.write(str(os.getpid()))

    # Exec bun run dev in this daemonized process
    env = dict(os.environ)
    env["PYTHONUNBUFFERED"] = "1"
    env["FORCE_COLOR"] = "1"
    try:
        proc = subprocess.Popen(
            ["bun", "run", "dev"],
            cwd=WORK_DIR,
            env=env,
            stdout=log_fd,
            stderr=log_fd,
            stdin=devnull_fd,
            close_fds=True,
        )
        proc.wait()
    finally:
        try:
            os.unlink(PID_FILE)
        except OSError:
            pass


if __name__ == "__main__":
    main()
