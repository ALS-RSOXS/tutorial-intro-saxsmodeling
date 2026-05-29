# Remote Computing via SSH

!!! note "Read this later"
    This appendix can be skipped for now. You will not need remote computing until
    later in the tutorial. Return here when your supervisor or instructor says it is
    time.

Some calculations later in this tutorial are computationally demanding. Rather than
waiting for your laptop to finish a long job, you can connect to a more powerful
remote machine — such as a departmental server or a high-performance computing cluster
— and run the code there.

The standard tool for this is **SSH** (Secure Shell), which opens a terminal session
on a remote machine over a network connection.

## Connecting to a remote machine

```console
$ ssh username@hostname.university.edu
```

Replace `username` with your account name on the remote system and
`hostname.university.edu` with the address your institution provides.

If you already set up an SSH key pair (see [SSH Keys](../section1-setup/5-ssh-keys.md)),
you can copy your public key to the remote machine to avoid entering a password each
time:

```console
$ ssh-copy-id username@hostname.university.edu
```

## VS Code Remote-SSH

The VS Code **Remote - SSH** extension lets you use the full VS Code interface —
including Jupyter notebooks — while the code actually runs on the remote machine.
Install it from the Extensions panel (search for **Remote - SSH**) and connect via
`Ctrl+Shift+P` → **Remote-SSH: Connect to Host**.

This is the recommended way to work on a remote machine if you are already using
VS Code for local development.

## Transferring files

To copy a file **to** the remote machine:

```console
$ scp localfile.ipynb username@hostname.university.edu:~/destination/
```

To copy a file **from** the remote machine to your local computer:

```console
$ scp username@hostname.university.edu:~/remotefile.ipynb ./
```

For whole folders, add the `-r` (recursive) flag:

```console
$ scp -r saxs-tutorial/ username@hostname.university.edu:~/
```

## Running Jupyter on a remote machine

If you prefer the browser-based Jupyter interface, you can run a Jupyter server on
the remote machine and view it in your local browser by forwarding the network port
over SSH.

**Step 1:** Connect with port forwarding enabled:

```console
$ ssh -L 8888:localhost:8888 username@hostname.university.edu
```

**Step 2:** On the remote machine, start JupyterLab:

```console
$ uv run jupyter lab --no-browser --port=8888
```

**Step 3:** Copy the URL that JupyterLab prints — it will look like
`http://localhost:8888/lab?token=...` — and paste it into your local browser.

You now have a full JupyterLab interface running on the remote machine, displayed in
your local browser.

## Keeping sessions alive with tmux

If your SSH connection drops while a calculation is running, that calculation is
killed. **tmux** is a terminal multiplexer that keeps your session alive on the remote
machine even if the connection is interrupted.

```console
# Start a new named session
$ tmux new -s tutorial

# Detach (session keeps running in the background)
# Press Ctrl+B, then D

# Reattach after reconnecting via SSH
$ tmux attach -t tutorial
```

A concise tmux reference is available at [tmuxcheatsheet.com](https://tmuxcheatsheet.com).
