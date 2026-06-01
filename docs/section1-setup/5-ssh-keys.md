GitHub needs a way to verify that it is really you when you push code to your account.
The recommended method is **SSH key authentication**, which is more secure than a
password and, once configured, requires no further action from you.

!!! note "Key Concept: Public and Private Keys"
    SSH authentication works by generating two mathematically linked files: a
    **private key** stored only on your computer and a **public key** that you share
    with GitHub. When you connect to GitHub, your computer proves it holds the private
    key without ever revealing it — like a lock-and-key system where the lock is public
    but the key is yours alone.

    The private key lives at `~/.ssh/id_ed25519`.

    !!! warning "Never share your private key"
        The file you upload to GitHub is the **public** key — `id_ed25519.pub`, with
        the `.pub` extension. Never share, upload, or email the private key file.

## Step 1: Generate an SSH key pair

=== "macOS / Linux"
    ```console
    $ ssh-keygen -t ed25519 -C "your.email@example.com"
    ```

=== "Windows (PowerShell)"
    ```console
    $ ssh-keygen -t ed25519 -C "your.email@example.com"
    ```

When prompted for a file location, press **Enter** to accept the default
(`~/.ssh/id_ed25519`). You may change the name of the key if you would like to better indicate that it is for Github. When prompted for a passphrase, you may press **Enter** twice
to leave it empty, or set a passphrase for additional security.

## Step 2: Copy your public key

=== "macOS"
    ```console
    $ cat ~/.ssh/id_ed25519.pub | pbcopy
    ```
    The public key is now in your clipboard.

=== "Linux"
    ```console
    $ cat ~/.ssh/id_ed25519.pub
    ```
    Copy the entire line of output (it starts with `ssh-ed25519`).

=== "Windows (PowerShell)"
    ```console
    $ Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
    ```
    The public key is now in your clipboard.

## Step 3: Add the public key to GitHub

1. Log in to [github.com](https://github.com)
2. Click your profile picture (top right) → **Settings**
3. In the left sidebar, click **SSH and GPG keys**
4. Click **New SSH key**
5. Give it a descriptive title, for example: *Laptop 2025*
6. Paste your public key into the **Key** field
7. Click **Add SSH key**

## Step 4: Test the connection

```console
$ ssh -T git@github.com
```

A successful connection produces:

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see a warning about the host's authenticity on first connection, type `yes` and
press Enter — this is expected behavior.

Full documentation is at
[docs.github.com — Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

---

**What's next:** [VS Code and Jupyter](6-vscode-jupyter.md) — the editor and notebook
environment where you will write all of your code.
