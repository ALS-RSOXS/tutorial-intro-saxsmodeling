# VS Code and Jupyter

## Installing VS Code

**Visual Studio Code** (VS Code) is a free, cross-platform code editor developed by
Microsoft. It has first-class support for Python and Jupyter notebooks and is widely
used in both academic research and industry.

Download it from [code.visualstudio.com](https://code.visualstudio.com) and follow
the installer for your operating system.

## Installing extensions

VS Code's capabilities are extended through **extensions**. Open the Extensions panel
by clicking the puzzle-piece icon in the left sidebar, or press `Ctrl+Shift+X`
(Windows / Linux) or `Cmd+Shift+X` (macOS). Install the following:

| Extension | Publisher | Purpose |
|---|---|---|
| **Python** | Microsoft | Language support, linting, environment management |
| **Jupyter** | Microsoft | Run Jupyter notebooks directly inside VS Code |

## Selecting your Python interpreter

After installing the Python extension, open the Command Palette with `Ctrl+Shift+P`
(Windows / Linux) or `Cmd+Shift+P` (macOS) and search for
**Python: Select Interpreter**. Choose the interpreter inside your `.venv` folder —
it appears as something like `.venv (saxs-tutorial)`.

This tells VS Code to use the packages you installed with `uv`. If you skip this step,
VS Code may use a different Python installation and your imports will fail.

!!! warning "If the .venv interpreter does not appear"
    Make sure you opened the `saxs-tutorial` folder (not a parent folder) in VS Code.
    VS Code looks for `.venv` relative to the workspace root. If it still does not
    appear, run `uv sync` in the terminal first to ensure the environment exists.

## Opening your project

Go to **File → Open Folder** and select your `saxs-tutorial` folder. The file
explorer on the left shows the project contents.

## Anatomy of a Jupyter notebook

A Jupyter notebook is a document made up of **cells**. There are two types you will
use regularly:

- **Markdown cells** — formatted text, headings, and narrative explanation. Equations
  can be written using LaTeX notation (for example, `$\sin(x)$` renders as $\sin(x)$).
- **Code cells** — Python code that runs one cell at a time, with output appearing
  directly below.

This combination makes notebooks well-suited to scientific work: you can describe what
you are about to compute, run the code, and have the result — including figures —
appear in the same document. A well-written notebook is a complete, reproducible record
of a calculation that a collaborator can follow and re-run.

## Hello, Scientific Python

Create a new file called `chapter_01_hello.ipynb`. In the VS Code file explorer, click
the new-file icon, type the filename with the `.ipynb` extension, and VS Code opens it
as a notebook automatically.

### Your first markdown cell

Click **+ Markdown** to add a markdown cell and type:

```markdown
# Chapter 1: Hello, Scientific Python

This notebook confirms that the environment is working correctly.
```

Press `Ctrl+Enter` to render the cell. The text appears formatted as a heading.

### Your first code cell

Click **+ Code** to add a code cell and type the traditional first program:

```python
print("Hello, world!")
```

Press `Shift+Enter` to run the cell. The text `Hello, world!` appears immediately
below it, and the cursor moves to the next cell.

### Testing the scientific packages

Add a second code cell and type the following exactly:

```python
import numpy as np
import matplotlib.pyplot as plt

# 200 evenly spaced values from 0 to 2*pi
x = np.linspace(0, 2 * np.pi, 200)
y = np.sin(x)

fig, ax = plt.subplots()
ax.plot(x, y, color="steelblue", label=r"$\sin(x)$")
ax.set_xlabel(r"$x$ (radians)")
ax.set_ylabel(r"$\sin(x)$")
ax.legend(loc="upper right")
plt.show()
```

Run this cell. A sine wave appears inline below the cell.

!!! note "Inline figures in VS Code"
    Inside a Jupyter notebook in VS Code, figures appear directly below the code cell
    that produced them. This is one of the reasons notebooks are convenient for
    exploratory scientific work — the code, the narrative, and the results all live
    together in one document.

If the sine wave appears, your environment is fully working and you are ready to move on.

!!! example "Try It Yourself"
    1. Add a new markdown cell below the plot. Write a sentence in your own words
       describing what the sine wave is showing — what does the x-axis represent?
       What does the y-axis represent? What does one full period of the wave look like?
    2. Add a third code cell and plot $\cos(x)$ on the same axes as $\sin(x)$. Give
       each curve a different color and include both in the legend.

??? success "Solution"
    For the combined sine and cosine plot:

    ```python
    import numpy as np
    import matplotlib.pyplot as plt

    x = np.linspace(0, 2 * np.pi, 200)

    fig, ax = plt.subplots()
    ax.plot(x, np.sin(x), color="steelblue", label=r"$\sin(x)$")
    ax.plot(x, np.cos(x), color="tomato",    label=r"$\cos(x)$")
    ax.set_xlabel(r"$x$ (radians)")
    ax.set_ylabel("Value")
    ax.legend(loc="upper right")
    plt.show()
    ```

    The two curves are identical in shape but offset by $\pi/2$ radians (a quarter
    period). This offset is visible in the plot: the cosine reaches its maximum at
    $x = 0$, while the sine is zero there.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_01_hello.ipynb
    $ git commit -m "add hello world notebook"
    ```

---

**What's next:** [Your First Commit](7-first-commit.md) — saving this work permanently
with Git and pushing it to GitHub.
