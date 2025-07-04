function initDashboard() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) {
    alert("⚠️ আপনি এখনো রেজিস্ট্রেশন করেননি! রেজিস্ট্রেশন করুন।");
    window.location.href = "registration.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    alert("⚠️ লগইন তথ্য পাওয়া যায়নি!");
    window.location.href = "login.html";
    return;
  }

  updateBalanceUI(user.balance || 0);
  renderActivePlans(user);
  startProfitTimer(user, email);
}

function updateBalanceUI(amount) {
  document.getElementById("balance").innerText = "৳" + amount;
}

function handleBuyPlan(price, dailyProfit, days) {
  const email = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem(email));

  if (user.balance < price) {
    alert("❌ পর্যাপ্ত ব্যালেন্স নেই!");
    return;
  }

  if (!user.activePlans) user.activePlans = [];

  user.balance -= price;
  const plan = {
    price,
    dailyProfit,
    remainingDays: days,
    lastCollected: Date.now(),
    nextCollectTime: Date.now() + 24 * 60 * 60 * 1000
  };

  user.activePlans.push(plan);
  localStorage.setItem(email, JSON.stringify(user));

  updateBalanceUI(user.balance);
  renderActivePlans(user);
  alert("✅ সফলভাবে প্ল্যান ক্রয় হয়েছে!");
}

function renderActivePlans(user) {
  const section = document.getElementById("activePlansSection");
  section.innerHTML = "";

  if (!user.activePlans || user.activePlans.length === 0) {
    section.innerHTML = "<p>🚫 এখনো কোনো প্ল্যান অ্যাক্টিভ নয়।</p>";
    return;
  }

  user.activePlans.forEach((plan, index) => {
    const now = Date.now();
    const remainingTime = plan.nextCollectTime - now;

    // Calculate time left for countdown
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Timer text
    const timerText = remainingTime > 0
      ? `⏳ লাভ আসবে: ${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ডে`
      : `⏰ এখন লাভ সংগ্রহ করা যাবে!`;

    // Button status: disabled (কালো) if time left, enabled (সবুজ) if time elapsed
    const isClaimEnabled = remainingTime <= 0 && plan.remainingDays > 0;
    const buttonClass = isClaimEnabled ? "claim-btn active" : "claim-btn disabled";

    const div = document.createElement("div");
    div.className = "active-plan-card";
    div.innerHTML = `
      <p>📦 প্ল্যান ${index + 1}: ৳${plan.price} | দৈনিক লাভ: ৳${plan.dailyProfit}</p>
      <p>🗓️ বাকি দিন: ${plan.remainingDays}</p>
      <p>${timerText}</p>
      <button class="${buttonClass}" ${isClaimEnabled ? "" : "disabled"} onclick="collectProfit(${index})">💰 লাভ ক্লেম করুন</button>
    `;
    section.appendChild(div);
  });
}

function collectProfit(index) {
  const email = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem(email));
  const plan = user.activePlans[index];

  if (plan.remainingDays <= 0) {
    alert("⚠️ প্ল্যানের সময় শেষ হয়েছে!");
    return;
  }

  if (Date.now() < plan.nextCollectTime) {
    alert("⚠️ এখনো লাভ সংগ্রহ করার সময় হয়নি।");
    return;
  }

  plan.remainingDays--;
  plan.lastCollected = Date.now();
  plan.nextCollectTime = Date.now() + 24 * 60 * 60 * 1000;
  user.balance += plan.dailyProfit;

  localStorage.setItem(email, JSON.stringify(user));
  updateBalanceUI(user.balance);
  renderActivePlans(user);
  alert(`🎉 লাভ সফলভাবে যুক্ত হয়েছে! আপনার ব্যালেন্সে ৳${plan.dailyProfit} যোগ হয়েছে।`);
}

// এই ফাংশন রিডিম কোড থেকে ব্যালেন্স যোগ করতে ব্যবহৃত হবে
function addBalanceFromRedeem(value) {
  const email = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem(email));
  user.balance = (user.balance || 0) + value;
  localStorage.setItem(email, JSON.stringify(user));
  updateBalanceUI(user.balance);
  renderActivePlans(user);
  alert("✅ রিডিম সফল হয়েছে! ব্যালেন্সে ৳" + value + " যোগ হয়েছে।");
}

// ২৪ ঘণ্টার টাইমার আপডেটের জন্য প্রতি সেকেন্ডে কল করা হয়
function startProfitTimer(user, email) {
  setInterval(() => {
    // শুধু UI রিফ্রেশ করবে টাইমার
    renderActivePlans(user);
  }, 1000);
}