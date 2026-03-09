(function emailOverrideBootstrap() {
    var TARGET_EMAIL = "info@zmrautomotive.cz";
    var LEGACY_EMAILS = ["jakubchmura9@gmail.com", "info@zmrautomovite.cz", "onboarding@resend.dev"];

    function replaceLegacyEmails(value) {
        var text = String(value || "");
        for (var i = 0; i < LEGACY_EMAILS.length; i += 1) {
            var legacy = LEGACY_EMAILS[i];
            if (legacy) {
                text = text.split(legacy).join(TARGET_EMAIL);
            }
        }
        return text;
    }

    function normalizeAnchor(anchor) {
        if (!anchor) {
            return;
        }

        var href = anchor.getAttribute("href");
        if (href) {
            var nextHref = replaceLegacyEmails(href);
            if (nextHref !== href) {
                anchor.setAttribute("href", nextHref);
            }
        }

        var text = anchor.textContent;
        if (text) {
            var nextText = replaceLegacyEmails(text);
            if (nextText !== text) {
                anchor.textContent = nextText;
            }
        }
    }

    function normalizeDocumentEmails(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var anchors = scope.querySelectorAll("a[href], a");
        for (var i = 0; i < anchors.length; i += 1) {
            normalizeAnchor(anchors[i]);
        }
    }

    function installFetchOverride() {
        if (typeof window.fetch !== "function") {
            return;
        }

        var nativeFetch = window.fetch.bind(window);
        window.fetch = function patchedFetch(input, init) {
            var nextInput = input;
            var nextInit = init;

            if (typeof nextInput === "string") {
                nextInput = replaceLegacyEmails(nextInput);
            } else if (nextInput instanceof URL) {
                nextInput = new URL(replaceLegacyEmails(nextInput.toString()));
            }

            if (nextInit && typeof nextInit === "object") {
                nextInit = Object.assign({}, nextInit);
                if (typeof nextInit.body === "string") {
                    nextInit.body = replaceLegacyEmails(nextInit.body);
                }
            }

            return nativeFetch(nextInput, nextInit);
        };
    }

    function installDomObserver() {
        var runNormalization = function () {
            normalizeDocumentEmails(document);
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", runNormalization, { once: true });
        } else {
            runNormalization();
        }

        if (typeof MutationObserver === "function") {
            var observer = new MutationObserver(function () {
                runNormalization();
            });

            var startObserver = function () {
                observer.observe(document.documentElement || document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            };

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", startObserver, { once: true });
            } else {
                startObserver();
            }
        }
    }

    window.ZMR_RESERVATION_PROXY_URL = "https://formsubmit.co/ajax/" + TARGET_EMAIL;
    window.ZMR_RESERVATION_EMAIL = TARGET_EMAIL;

    installFetchOverride();
    installDomObserver();
})();
