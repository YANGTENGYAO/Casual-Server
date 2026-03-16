// --- Animated cards entrance ---
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animated-card').forEach(card => {
        observer.observe(card);
    });
});


// --- Server Status & Copy IP ---
const SERVER_IP = "pobo0204.xyz";
const API_URL = `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`;

const serverCard = document.getElementById('serverCard');
const statusDot = document.getElementById('dot');
const statusText = document.getElementById('status');
const versionText = document.getElementById('version');
const playersText = document.getElementById('players');
const ipText = document.getElementById('ipText');

ipText.textContent = SERVER_IP;

function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        if (!serverCard.classList.contains('show-success')) {
            serverCard.classList.add('show-success');
            setTimeout(() => {
                serverCard.classList.remove('show-success');
            }, 2000);
        }
    }).catch(err => {
        console.error('無法複製 IP:', err);
    });
}

async function fetchServerStatus() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API 請求失敗，狀態碼: ${response.status}`);
        }
        const data = await response.json();

        if (data.online) {
            statusDot.classList.remove('offline');
            statusDot.classList.add('online');
            statusText.textContent = '正常';
            versionText.textContent = data.version.name_clean;
            playersText.textContent = `${data.players.online} / ${data.players.max}`;
        } else {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = '離線';
        }
    } catch (error) {
        console.error("查詢伺服器狀態時發生錯誤:", error);
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
        statusText.textContent = '查詢失敗';
    }
}

// Initial fetch and set interval
fetchServerStatus();
setInterval(fetchServerStatus, 60000); // 每 60 秒更新一次
