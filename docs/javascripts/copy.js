/**
 * Injects a "Copy" button into every .highlight and .codehilite code block.
 * Works with both initial page load and MkDocs instant-navigation re-renders.
 */
(function () {
    "use strict";

    function addCopyButtons() {
        document.querySelectorAll(".highlight, .codehilite").forEach(function (block) {
            if (block.querySelector(".copy-button")) return; // already injected

            var pre = block.querySelector("pre");
            if (!pre) return;

            var btn = document.createElement("button");
            btn.className = "copy-button";
            btn.textContent = "Copy";
            btn.setAttribute("aria-label", "Copy code to clipboard");
            block.appendChild(btn);

            btn.addEventListener("click", function () {
                var text = pre.innerText !== undefined ? pre.innerText : pre.textContent;

                var reset = function () {
                    btn.textContent = "Copy";
                    btn.classList.remove("copied");
                };

                var confirm = function () {
                    btn.textContent = "Copied!";
                    btn.classList.add("copied");
                    setTimeout(reset, 1800);
                };

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(confirm).catch(function () {
                        fallbackCopy(text, confirm);
                    });
                } else {
                    fallbackCopy(text, confirm);
                }
            });
        });
    }

    function fallbackCopy(text, callback) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand("copy");
            if (callback) callback();
        } catch (e) {
            // copy failed silently
        }
        document.body.removeChild(ta);
    }

    // Initial load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addCopyButtons);
    } else {
        addCopyButtons();
    }

    // MkDocs Material / rsoxs instant navigation fires a custom event after
    // each page swap. Re-inject buttons on every navigation.
    document.addEventListener("DOMContentSwitch", addCopyButtons);

    // Also handle MkDocs Material's document$ RxJS observable if present.
    if (typeof window !== "undefined") {
        window.addEventListener("load", function () {
            if (typeof document$ !== "undefined" && document$.subscribe) {
                document$.subscribe(addCopyButtons);
            }
        });
    }
})();
