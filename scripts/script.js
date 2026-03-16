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
    const cacheKey = 'serverStatusCache';
    const cachedData = JSON.parse(sessionStorage.getItem(cacheKey));
    const now = new Date().getTime();

    // 1. 如果有快取，先顯示快取資料
    if (cachedData && now < cachedData.expires) {
        updateStatusUI(cachedData.data);
    }

    // 2. 無論是否有快取，都去抓取最新資料 (除非快取還很新)
    if (!cachedData || now >= cachedData.expires) {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API 請求失敗，狀態碼: ${response.status}`);
            }
            const data = await response.json();

            // 更新 UI 並存入快取
            updateStatusUI(data);
            sessionStorage.setItem(cacheKey, JSON.stringify({
                data: data,
                expires: now + 5 * 60 * 1000 // 5 分鐘後過期
            }));

        } catch (error) {
            console.error("查詢伺服器狀態時發生錯誤:", error);
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = '查詢失敗';
        }
    }
}

function updateStatusUI(data) {
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
}

// Initial fetch and set interval
fetchServerStatus();
setInterval(fetchServerStatus, 60000); // 每 60 秒更新一次
