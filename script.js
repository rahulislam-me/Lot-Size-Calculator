const fields = [
    "balance",
    "entry",
    "lot",
    "contract",
    "sl",
    "tp",
    "direction"
];

const $ = id => document.getElementById(id);

const formatMoney = value =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

const formatNumber = value =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

// UI only: show the matching icon for BUY / SELL
function updateDirectionIcon(direction) {
    const wrap = $("direction").closest(".select-wrap");
    wrap.classList.toggle("is-buy", direction === "buy");
    wrap.classList.toggle("is-sell", direction === "sell");
}

function calculate() {
    const balance = Number($("balance").value);
    const entry = Number($("entry").value);
    const lot = Number($("lot").value);
    const contract = Number($("contract").value);
    const sl = Number($("sl").value);
    const tp = Number($("tp").value);
    const direction = $("direction").value;

    updateDirectionIcon(direction);

    // Validate inputs
    const values = [balance, entry, lot, contract, sl, tp];

    if (values.some(value => !Number.isFinite(value) || value < 0) ||
        balance <= 0 || entry <= 0 || lot <= 0 ||
        contract <= 0 || sl <= 0 || tp <= 0) {
        $("rr").textContent = "Invalid Setup";
        $("rr").classList.add("invalid");
        return;
    }

    $("rr").classList.remove("invalid");

    // Calculate position value
    const positionValue = lot * contract * entry;

    // Calculate profit and loss
    const loss = lot * contract * sl;
    const profit = lot * contract * tp;

    // Calculate account risk percentage
    const riskPercent = (loss / balance) * 100;
    const profitPercent = (profit / balance) * 100;

    // Calculate Risk Reward Ratio
    const rr = tp / sl;

    // Calculate margin using a configurable leverage assumption
    const leverage = 1000;
    const margin = positionValue / leverage;

    // Calculate SL and TP price levels
    const slPrice = direction === "buy"
        ? entry - sl
        : entry + sl;

    const tpPrice = direction === "buy"
        ? entry + tp
        : entry - tp;

    // Update RR
    $("rr").textContent = `1 : ${rr.toFixed(2)}`;

    // Update Profit & Loss
    $("loss").textContent = "-" + formatMoney(loss);
    $("profit").textContent = "+" + formatMoney(profit);

    $("riskPercent").textContent =
        `${riskPercent.toFixed(2)}% of balance`;

    $("profitPercent").textContent =
        `${profitPercent.toFixed(2)}% of balance`;

    // Price levels
    $("entryPrice").textContent = formatMoney(entry);
    $("slPrice").textContent = formatMoney(slPrice);
    $("tpPrice").textContent = formatMoney(tpPrice);

    // Balance projection
    $("afterLoss").textContent = formatMoney(balance - loss);
    $("afterProfit").textContent = formatMoney(balance + profit);
}

// Listen for input changes
fields.forEach(id => {
    $(id).addEventListener("input", calculate);
    $(id).addEventListener("change", calculate);
});

// Initial calculation
calculate();

// LUCIDE ICONS
lucide.createIcons();